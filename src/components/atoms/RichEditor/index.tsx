import React, { useEffect, useRef, useState } from 'react';
import {Button as ButtonPrime} from 'primereact/button';
import './RichEditor.scss';
import { RE_Bold } from '../../../assets';

interface ParamButton {
  type: 'bold'|'italic';
  flagStatusToolbox:{}; // {'bold':true, ...}
  outChange?:(element:{type:string, status_active:boolean})=>void;
  [key:string]:any;
}

// *** Komponen Button
const ButtonPrimeEditor:React.FC<ParamButton> = ({type, flagStatusToolbox, outChange}) => {

  // ** {'bold':true}
  const [flagStatusClick, setFlagStatusClick] = useState<{}>({});

  useEffect(()=>{
    setFlagStatusClick(prev=>{
      return {
        ...prev,
        ...flagStatusToolbox
      }
    })
    console.log(JSON.stringify(flagStatusToolbox,null,2))
  },[flagStatusToolbox])

  const handleClick = (type_param) => {

    if (outChange){

        let status_type = flagStatusClick?.[type_param];
        if (typeof status_type != 'undefined'){
          status_type = !status_type;
        } else {
          status_type = true; // jika tidak ada dibuat true, artinya sedang diklik aktif
        }


        setFlagStatusClick({...flagStatusClick, [type_param]: status_type});

        outChange({type:type_param, status_active: status_type});

    }
  }

  return (
    <ButtonPrime outlined rounded severity='secondary'
        style={{width:'25px', height:'25px', border:'0px solid red', padding:'4px', boxShadow:'none'
                , backgroundColor:`${flagStatusClick?.[type] ? 'lightgrey':''}`
        }}
        className='ms-2 d-flex justify-content-center align-items-center'
        onClick={()=>handleClick(type)}
        // onClick={()=>handleLoginWithConnect('google-oauth2')}
    >
        {type ==='bold' && (<img src={RE_Bold} width="100%" height="100%" />)}

    </ButtonPrime>
  )
}

// --- *** Komponen Button

function RichEditor() {

  // ** {'bold':true, ...}
  const [flagStatusToolbox, setFlagStatusToolbox] = useState<{}>({});
  const [flagStatusUpdate, setFlagStatusUpdate] = useState<{}>({});

  const refContainer = useRef<any>(null);

  // ** Element apa saja di dalam pada posisi caret sekarang
  const refElementCurrentByCaretPos = useRef<any>(null);  // {'bold':true, ...}
  const [eleCurrByCaretPos, setEleCurrByCaretPos] = useState<any>();  // {'bold':true, ...}
  // ---- ***

  const [rangeOffset, setRangeOffset] = useState<any>();
  
  const pollingRef = useRef<any>(null);

  useEffect(()=>{
    const handleSelectionChange = () => {
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {

          let range:any = selection?.getRangeAt(0);
          
          if (refContainer.current.contains(range.startContainer)) {

            setRangeOffset({'startOffset':range?.startOffset, 'parent':range?.startContainer.parentElement});
            // let parent = range?.startContainer.nodeType === Node.TEXT_NODE ? range?.startContainer.parentElement : range?.startContainer;
            
            let parent = range?.startContainer.parentElement;
            if (parent){

              let closeParent = parent.closest('.re-span-container');
              if (closeParent){

                  refElementCurrentByCaretPos.current = null;

                  const rekursifSetElementChild = (node) => {

                    if (node.nodeType === Node.ELEMENT_NODE) {

                      if (node.tagName === 'B'){
                        refElementCurrentByCaretPos.current = {...refElementCurrentByCaretPos.current, 'bold':true}
                      } else if (node.tagName === 'I'){
                        refElementCurrentByCaretPos.current = {...refElementCurrentByCaretPos.current, 'italic':true}
                      } else if (node.tagName === 'U'){
                        refElementCurrentByCaretPos.current = {...refElementCurrentByCaretPos.current, 'underline':true}
                      }

                      if (node.childNodes.length > 0) {
                        node.childNodes.forEach(rekursifSetElementChild);
                      }

                    }

                  }

                  if (closeParent.childNodes.length > 0){
                    // *** Masukkan semua data child nodes element (tag) yang terdeteksi
                    closeParent.childNodes.forEach(rekursifSetElementChild);

                    console.log(refElementCurrentByCaretPos.current)
                  }

              }
              // console.log(closeParent)
              // setEleCurrByCaretPos({})
              // console.log()
            }
          }
        }

    }

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (!pollingRef.current){
          pollingRef.current = setInterval(handleSelectionChange, 30)
        }
      }
    }

    const handleKeyUp = (e) => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    // window.addEventListener('selectionchange', handleSelectionChange);  // chrome not support
    window.addEventListener('keydown', handleKeyDown);  // chrome not support
    window.addEventListener('keyup', handleKeyUp);  // chrome not support

    
    return () => {
      // window.removeEventListener('selectionchange', handleSelectionChange); // chrome not support
      window.removeEventListener('keydown', handleKeyDown);  // chrome not support
      window.removeEventListener('keyup', handleKeyUp);  // chrome not support
      if (pollingRef.current){
        clearInterval(pollingRef.current)
      }
    }
  },[])
  

  const handleClickButton = (obj) => {

      // *** Klik Icon Toolbox

      // console.info(obj)

      let status_active = obj?.['status_active'] ?? true;

      console.log(obj)

      // {'bold': true}
      setFlagStatusUpdate({...flagStatusUpdate, [obj?.['type']]:obj?.['status_active'] })

      let selection:Selection|null = window.getSelection();
      if (selection && selection.rangeCount > 0){
        let range = selection?.getRangeAt(0);
        let range_current = range.startContainer;
        
        let new_range = document.createRange();
        new_range.setStart(range_current, range.startOffset);
        new_range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(new_range);
      }

      
      // let selection:Selection|null = window.getSelection();

      // if (selection){
      //   if (selection?.rangeCount > 0)
      //   {
          
      //   let range:any = selection?.getRangeAt(0);
      //   let containerRef = refContainer.current;
  
      //   // ** Periksa apakah posisi caret ada di dalam container (itu yang akan di proses)
      //   if (containerRef.contains(range.startContainer) || containerRef.contains(range.endContainer)){

      //     // *** jika status nya aktif untuk element bold, baru lanjut kasih element bold
      //     if (status_active)
      //     {
      //       // ** tidak ada teks yang ter-seleksi
      //       if (range === null || range.toString() === ''){
              
      //           // *** Tipe 'Bold' (penebalan huruf)
      //           if (obj.type === 'bold'){
  
      //             let ele_bold:any = document.createElement('B');
      //             ele_bold.textContent = "\u200B"; // "u200B" -> zero width space (penghubung element dan kata-kata agar terhubung tanpa menambah spasi baru)
  
      //             let create_range = document.createRange();
                  
      //             create_range.setStart(ele_bold.firstChild, 1);
      //             create_range.setEnd(ele_bold.firstChild, 1);
  
      //             range.deleteContents();
      //             range.insertNode(ele_bold);
  
      //             selection.removeAllRanges();
      //             selection.addRange(create_range);
  
      //           }
      //         }
      //     }
      //     else {
      //       // ** Jika status Bold tidak aktif

      //       // ** tidak ada teks yang ter-seleksi
      //       if (range === null || range.toString() === ''){

      //         // *** Tipe 'Bold' (penebalan huruf)
      //         if (obj.type === 'bold'){
      //           let caretPosition = range.startOffset;

      //           let boldElement = range.startContainer.parentNode;  // tag 'B'
      //           if (boldElement?.tagName && boldElement?.tagName === 'B'){
                  
      //             // Pecah teks dalam elemen `<b>` di posisi caret
      //             let textBeforeCaret = boldElement.textContent.slice(0, caretPosition);
      //             let textAfterCaret = boldElement.textContent.slice(caretPosition);

      //             // ** Buat baru element bold yang After dari posisi caret sampai ujung element
      //             let newBoldElement = document.createElement("B");
      //             newBoldElement.textContent = textAfterCaret;

      //             // ** Modifikasi element bold saat ini dan timpa dengan "text before caret"
      //             boldElement.textContent = textBeforeCaret;

      //             boldElement.parentNode.insertBefore(
      //               newBoldElement,
      //               boldElement.nextSibling
      //             );

      //             let newTextNode = document.createTextNode("\u200B");
      //             boldElement.parentNode.insertBefore(
      //               newTextNode,
      //               newBoldElement
      //             );

      //             // ** Hilangkan semua tag b kosong yang hanya berisi \u200B
      //             let tagInContainer = containerRef.querySelectorAll('b');
      //             if (tagInContainer != null){
      //               tagInContainer.forEach((ele, index)=>{
      //                 if (!ele.textContent.trim() 
      //                       || /^[\u200B]*$/gi.test(ele.textContent)) {  // ** jika kosong dan hanya spasi, maka remove (memeriksa apakah elemen hanya berisi \u200B)
      //                   // console.log(ele.textContent.trim());
      //                   ele.remove();
      //                   console.log(ele.textContent)
      //                 }
      //                 else {
      //                   ele.textContent = ele.textContent.replace(/\u200B/g, '');
      //                 }
      //               });


      //               // * childNodes -> tidak bisa cari terlalu dalam, maka harus rekursif
      //               // const removeZeroWidthSpace = (node) => {
      //               //   if (node.nodeType === Node.TEXT_NODE) {
      //               //     node.textContent = node.textContent.replace(/\u200B/g, '');
      //               //   } else if (node.nodeType === Node.ELEMENT_NODE) {
      //               //     node.childNodes.forEach(removeZeroWidthSpace);
      //               //   }
      //               // }
                    
      //               // * hapus semua \u200B dalam text node dalam containerRef
      //               if (containerRef) {
      //                 removeZeroWidthSpace(containerRef)
      //               }
      //               // ***--- End Rekursif
                    
      //             }

      //             // Set caret ke posisi baru
      //             let newRange = document.createRange();
      //             newRange.setStart(newTextNode, newTextNode.length > 0 ? 1 : 0);
      //             newRange.collapse(true);  // "true" -> hanya mengacu pada posisi start

      //             selection.removeAllRanges();
      //             selection.addRange(newRange);
      //           }

      //         }

      //       }
            

      //     }

      //   }

      //   // let isContained = containerRef.contains(selection);
  
      //   // alert(selection?.isCollapsed)
      //   }
      // }
    
  }

  const handleKeyDown = (e) => {
    // if (e.keyCode >= 37 && e.keyCode <= 40){
        
    //   let selection:Selection|null = window.getSelection();

    //   if (selection && selection.rangeCount > 0){
    //     let range:any = selection.getRangeAt(0);
    //     let parentRange = range.startContainer.parentNode;
        
    //     if (parentRange?.tagName 
    //             // && parentRange?.tagName === 'B'
    //     ){
          
    //         // const charBefore = range.startContainer.textContent?.[range.startOffset - 1]
    //         // const charAfter = range.startContainer.textContent?.[range.startOffset + 1]

            
    //         if (e.keyCode === 37) {

    //           let charBeforeNode = range.startContainer;

    //           let charBeforeOffset = range.startOffset - 1;

    //           // console.log(range.startContainer.nodeType)
    //           if (charBeforeNode.nodeType === Node.TEXT_NODE
    //                 && charBeforeNode.textContent
    //                 && charBeforeOffset > 0
    //           ) {
    //             return;
    //           }
    //           else {

    //               const getValidePreviousSibling = (node) => {

    //                   while(node) {
    //                     if (node.nodeType === 1) {
    //                       return node;
    //                     } else if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
    //                       return node;
    //                     }
    //                     node = node.previousSibling;
    //                   }
    //               }

    //               let flagStatusTemp:any = {...flagStatusToolbox};

    //               const parentNode = range.startContainer?.parentNode;
    //               const classParentNode = range.startContainer?.parentNode?.classList;
                  
    //               // console.log("range.startContainer.parentNode.classList.length");
    //               // console.log(parentNode.tagName);
    //               // console.log(parentNode.getAttribute('id')=== null);

    //               if ((classParentNode && classParentNode.contains('re-content-sub1'))
    //                     || 
    //                   (parentNode.tagName === 'DIV' && classParentNode.length === 0 && parentNode.getAttribute('id') === null)  // kondisi jika berada di container baris baru div yang otomatis di generate pada saat enter
    //                 )
    //               {
    //                   if (range?.startContainer?.previousSibling) 
    //                   {

    //                     let previousNode = getValidePreviousSibling(range.startContainer.previousSibling);
    //                     if (previousNode) {

    //                       if (previousNode.nodeType === 1) {
    //                         if (previousNode?.tagName && previousNode?.tagName === 'B'){
                              
    //                           flagStatusTemp = {...flagStatusTemp, 'bold': true}
    //                         }
    //                         else {flagStatusTemp = {...flagStatusTemp, 'bold': false}}

    //                         // console.log("previousNode")
    //                         // console.log(previousNode)
    //                         setFlagStatusToolbox({...flagStatusTemp});
    //                       }
    //                       else if (previousNode.nodeType === 3){
    //                         flagStatusTemp = {...flagStatusTemp, 'bold': false}
    //                         setFlagStatusToolbox({...flagStatusTemp});
    //                       }

    //                     }
    //                   }
    //               }
    //               else {

    //                   if (range.startContainer?.nodeType === Node.TEXT_NODE) 
    //                   {
    //                     // parent node saat ini bukan class 're-content-sub1' (container edit)
    //                     let previousSibling = getValidePreviousSibling(range.startContainer?.parentNode.previousSibling);
    //                     if (previousSibling.nodeType === Node.TEXT_NODE) {
    //                       flagStatusTemp = {...flagStatusTemp, 'bold': false}
    //                     }
    //                     else if (previousSibling.nodeType === Node.ELEMENT_NODE) {
    //                       if (previousSibling?.tagName === 'B'){
    //                         flagStatusTemp = {...flagStatusTemp, 'bold': true}
    //                       }
    //                       else {
    //                         flagStatusTemp = {...flagStatusTemp, 'bold': false}
    //                       }
    //                     }

    //                     setFlagStatusToolbox({...flagStatusTemp});
    //                     // console.log(previousSibling.nodeType)

    //                   }

    //               }

    //           }

    //         }
    //         else if (e.keyCode === 39){ 
                
    //           let charAfterNode = range.startContainer;

    //           let charAfterOffset = range.startOffset + 1;

    //           if (charAfterNode.nodeType === Node.TEXT_NODE 
    //                 && charAfterNode.textContent 
    //                 && charAfterOffset <= charAfterNode.textContent.length) 
    //           {
    //               const parentNode = charAfterNode.parentNode;
    //           }
    //           else {

    //             let flagStatusTemp:any = {...flagStatusToolbox};

    //             // cek saat ini
    //             const startNode = range.startContainer;
    //             // const parentNode = startNode?.parentNode;

    //             const classParentNode = startNode?.parentNode?.classList;

    //             if (classParentNode && classParentNode.contains('re-content-sub1'))
    //             {
    //               if (startNode.nodeType === Node.TEXT_NODE){

    //                 // * Periksa Node Selanjutnya 
    //                 let nextNode = startNode?.nextSibling;
    //                 if (nextNode) {
  
    //                     let tagName = nextNode?.tagName;
    //                     if (tagName) {
    //                         if (tagName === 'B'){
    //                             flagStatusTemp = {...flagStatusTemp, 'bold': true}
    //                             setFlagStatusToolbox({...flagStatusTemp});
    //                         }
    //                     }
    //                   }
    //               }
    //             }
    //             else {
    //               if (startNode.parentNode.nodeType === Node.ELEMENT_NODE) {

    //                 // ** Data Awal menggunakan next sibling node
    //                 // ** Fungsi nya untuk mencari next sibling yang bukan spasi dan baris baru
    //                 // ** Tujuan nya mendapatkan element selanjut nya apakah text atau element
    //                 const getValidNextSibling = (node) => {
    //                     while(node){
    //                       if (node.nodeType === 1) {
    //                         // jika element, maka return
    //                         return node;
    //                       }
    //                       else if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
    //                         // jika text, maka return text yang tidak kosong
    //                         return node;
    //                       }
    //                       node = node.nextSibling;
    //                     }

    //                     return null;
    //                 }
    //                 // ---

    //                 // ** nextSibling -> element selanjut nya yang paling lengkap (text, element, dst...)
    //                 // *** 'getValidNextSibling' -> cari next sibling yang bukan spasi dan baris baru
    //                 let nextSibling = getValidNextSibling(startNode?.parentNode.nextSibling);

    //                 // *** kondisi kalau Element
    //                 if (nextSibling?.nodeType && nextSibling?.nodeType === 1){
    //                     // 1 -> Element
    //                     // 2 -> Attribute
    //                     // 3 -> Text
    //                     // console.log("nextSibling")
    //                     // console.log(nextSibling.tagName)

    //                     if (nextSibling.tagName === 'B') {
    //                         flagStatusTemp = {...flagStatusTemp, 'bold': true}
    //                     }
    //                     else {
    //                         flagStatusTemp = {...flagStatusTemp, 'bold': false}
    //                     }

    //                     setFlagStatusToolbox({...flagStatusTemp});
    //                   }
    //                 else if (nextSibling.nodeType === 3)
    //                 {
    //                     flagStatusTemp = {...flagStatusTemp, 'bold': false}
    //                     setFlagStatusToolbox({...flagStatusTemp});
    //                 }

    //               }
    //             }

    //           }

              
    //         }

          
    //     } else {
    //         setFlagStatusToolbox({...flagStatusToolbox, 'bold': false})
    //     }
    //   }
      
    // }
    // else {
    
    // Daftar kode tombol yang ingin diabaikan
    const ignoreKeys = [
      16, // Shift
      17, // Ctrl
      18, // Alt
      19, // Pause/Break
      20, // CapsLock
      27, // Escape
      33, // Page Up
      34, // Page Down
      35, // End
      36, // Home
      37, // Left Arrow
      38, // Up Arrow
      39, // Right Arrow
      40, // Down Arrow
      45, // Insert
      46, // Delete
      112, // F1
      113, // F2
      114, // F3
      115, // F4
      116, // F5
      117, // F6
      118, // F7
      119, // F8
      120, // F9
      121, // F10
      122, // F11
      123, // F12
      144, // Num Lock
      145, // Scroll Lock
    ];

    if (ignoreKeys.includes(e.keyCode)){
      return;
    }
    
      // if (!e.ctrlKey && !e.altKey && !e.shiftKey && e.key !== 'Tab' && e.key !== 'CapsLock'
      //     && e.key !== 'Escape'
      //     && (!(e.keyCode >= 37 && e.keyCode <= 40))  // arrow left,top,right, bottom
      //     && (!(e.keyCode >= 112 && e.keyCode <= 123))  // f1 - f12
      // ) {
        if (e.key === 'Backspace' || e.key === 'Enter'){
          return
        }

          let selection:Selection|null = window.getSelection();

          if (selection && selection.rangeCount > 0) {

            let range:any = selection?.getRangeAt(0);

            // if (refContainer.current.contains(range.startContainer)) {

              let parent_node = range.startContainer?.parentNode;
              
              if (parent_node 
                  && refContainer.current.contains(parent_node)
              ) {

                let tag_name = parent_node?.tagName;
                
                if (tag_name !== 'B' && !flagStatusUpdate['bold']) {
                  // console.log(range.startContainer.textContent)
                }

                if (tag_name !== 'B' && Object.keys(flagStatusUpdate).length > 0 
                  && flagStatusUpdate?.['bold']
                ){
                  
                  let patt = /[a-zA-Z0-9]|[-_+=\!@#$%^&*()[\]\{\}:;\"\'\<\>.,\/\?\|\\`~]/gi;
                  // let patt = /[!@#$%^&*()_+=[\]{}|;:'",.<>?]/;
                  if (patt.test(e.key))
                  {

                    range.deleteContents(); // hapus yang terseleksi

                    let ele_bold = document.createElement('b');
                    ele_bold.textContent = e.key;
  
                    range.insertNode(ele_bold);
                    
                    // let new_range = document.createRange();
                    // new_range.setStart(ele_bold, 1);
                    // new_range.collapse(true);
  
                    // selection.removeAllRanges();
                    // selection.addRange(new_range);

                    // e.preventDefault();
                  }
                }
                // ** Kondisi Parent saat ini tag 'B' dan icon 'B' tidak aktif. berarti selanjutnya tidak boleh ada 'B'
                else if (tag_name === 'B' && Object.keys(flagStatusUpdate).length > 0 
                          && flagStatusUpdate?.['bold'] === false)
                {
                  
                    let currentNode = range.endContainer;
                    let currentParent = currentNode.nodeType === Node.TEXT_NODE ? currentNode.parentNode.closest('b') : currentNode;
                    if (currentParent?.tagName && currentParent?.tagName === 'B')
                    {
                        
                        // *** Masih Issue jadi double kalau ketik pertama setelah nya bukan bold
                      // range.deleteContents();

                      let new_node = document.createTextNode('\u200B');
                      // let textContent = currentNode.textContent;
                      
                      // let beforeCaret = textContent.slice(0, range.startOffset);
                      // let afterCaret = textContent.slice(range.startOffset);

                      // let before_node = document.createTextNode(beforeCaret);
                      // let new_node = document.createTextNode('Hello');

                      // let after_node_bold:any = document.createElement('h1');
                      // after_node_bold.textContent = afterCaret;

                      // let surNode = document.createElement('i');

                      // let rangesur = document.createRange();
                      // rangesur.selectNodeContents(after_node_bold);
                      // rangesur.surroundContents(surNode);

                      // // currentNode.parentNode.replaceChild(before_node, currentNode);

                      // currentNode.textContent = beforeCaret;
                      // currentParent.parentNode.insertBefore(new_node, null);
                      // currentParent.parentNode.insertBefore(after_node_bold, null);

                      // currentNode.parentNode.after(new_node, after_node);
        
                      // range.setStartAfter(new_node);
                      // range.collapse(true);
                      // selection.removeAllRanges();
                      // selection.addRange(range);
                      // -----------------

                      // console.log(currentParent?.nextSibling)

                      if(currentParent?.nextSibling === null){
                        currentParent.parentNode.insertBefore(new_node, null);
                      }
                      else {
                        currentParent.parentNode.insertBefore(new_node, currentParent?.nextSibling);
                      }

                      const new_range = document.createRange();
                      new_range.setStartAfter(currentParent?.nextSibling);
                      new_range.collapse(true);

                      selection.removeAllRanges();
                      selection.addRange(new_range);
                      
                    
                    }
                    
                }

              }

            // }
          }
      // }
    // }
  }

  // * childNodes -> tidak bisa cari terlalu dalam, maka harus rekursif
  const removeZeroWidthSpace = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = node.textContent.replace(/\u200B/g, '');
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(removeZeroWidthSpace);
    }
  }

  const handleKeyUp = (e) => {

    let selection = window.getSelection();
    let range = selection?.getRangeAt(0);

    if (e.keyCode >= 37 && e.keyCode <= 40) 
    {
      if (e.keyCode === 38 || e.keyCode === 40){
        if (refContainer.current) {
          // removeZeroWidthSpace(refContainer.current) 
          
          // console.log(range?.startContainer)
        }
        
      }
    }
    else {
      // Tujuannya untuk hapus \u200B setelah pengetikkan.
      
      if (selection && selection.rangeCount > 0) 
      {
        let currentNode = range?.startContainer;
        if (currentNode?.textContent) {
          if (currentNode?.textContent?.indexOf('\u200B') !== -1) {
            currentNode.textContent = currentNode?.textContent.replace(/\u200B/g, '');
            
            let new_range = document.createRange();
            new_range.setStart(currentNode, currentNode.textContent.length);
            new_range.collapse(true);

            selection.removeAllRanges();
            selection.addRange(new_range);
            
            console.log("currentNode")
            console.log(currentNode)
            console.log(currentNode.textContent.length)
          }
        }
      }

    }
  }

  return (
    <div ref={refContainer}>
        <div className='re-content'>

            {/* <span>Start Offset : {rangeOffset?.startOffset.toString()}</span>
            <span>Parent : {rangeOffset?.parent.tagName}</span> */}

            <span>{JSON.stringify(eleCurrByCaretPos)}</span>

            <div className='re-block-anim'></div>

            {/* Toolbox */}
            <div className='re-toolbox'>

                <div>
                    <ButtonPrimeEditor type='bold' outChange={handleClickButton}
                      flagStatusToolbox={flagStatusToolbox}
                    />
                </div>

            </div>

            {/* Editor Teks */}

            <div className='re-content-sub1' contentEditable={true} 
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                dangerouslySetInnerHTML={{__html:``+
                    `<span class="re-span-container re-111-abc"><b><u><i>Hello</i></u></b></span>`+
                    `<span class="re-span-container re-222-def">`+
                        `<u>World</u>` + 
                    `</span>
                  `}}
            >


            </div>

        </div>
    </div>
  )
}

export default RichEditor