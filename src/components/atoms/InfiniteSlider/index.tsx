import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Button } from "primereact/button";
import React, { useState, useRef, useEffect } from "react";

const images = ["https://asset.kompas.com/crops/JO-RHm6hr3ZTjf3D_d2ojH_TYLY=/0x0:900x600/750x500/data/photo/2019/07/19/5d31989499d6a.jpeg"
                , "https://akcdn.detik.net.id/visual/2023/10/30/ji-chang-wook_43.jpeg?w=720&q=90"
                , "https://cdn.idntimes.com/content-images/community/2023/09/20230919-153105-0000-8ef027a49ca26b7f8b4a69a84a46aa3d-df04472f7ea9298e02fa704541171802.png"];

interface paramInfiniteSlider {
  outputClick:(item:number)=>void;
  // [key:string]:any;
}

const InfiniteSlider:React.FC<paramInfiniteSlider> = ({outputClick}) => {

    // * outputClick -> event click output

    const containerRef = useRef<any>(null);
    const arrRef = useRef<any>([]);
    const startCondition = useRef<boolean>(true);
    const isDoneProcessArrItem = useRef<boolean>(true); // status proses arr item supaya tidak rekursif

    const clientWidth_Basic = useRef<number>(0);  // client width yang menyimpan lebar total element data tanpa 'prev' dan 'next'
  
    const [arrItem, setArrItem] = useState<any>([]);

    // slider baru
    const buttonNextRef = useRef<any>(null);
    const buttonPrevRef = useRef<any>(null);

    const [widthSubContainer, setWidthSubContainer] = useState<string>('0px');  // lebar sub container
    const containerNewRef = useRef<any>(null);
    const subContainerNewRef = useRef<any>(null);
    const arrNewRef = useRef<any>([]);
    const objTransformRef = useRef<any>({});  // {0:100, 1:100} posisi transform
    const isNewDragging = useRef<boolean>(false);
    const startXNew = useRef<number>(0);
    const isDoneProcessMouseMove = useRef<boolean>(true);

    const startXNew_ForItemClick = useRef<number>(0);
    
    // ---

    let data:any[] = [
          "Pontianak", "Nasional"
          , "Internasional", "Hotsport"
          , "Gaya Hidup", "Ekonomi"
          , "Finance", "Teknologi"
          , "Sastra"
    ];


    // useEffect(()=>{

    //   isDoneProcessArrItem.current = false;
    //   setArrItem([...data]);
      
    // },[]);

    // useEffect(()=>{
    //   let interval:any;

    //   if (!isDoneProcessArrItem.current) {

    //     interval = setInterval(()=>{
    //         let containerElement = containerRef.current;
    //         let targetElement = arrRef.current[arrItem.length-1];

    //         if (containerElement && targetElement){
  
    //           let scrollWidth_Container = containerRef.current.scrollWidth;
    //           let clientWidth_Container = containerRef.current.clientWidth;

    //           clientWidth_Basic.current = clientWidth_Container;
    //           // alert(clientWidth_Basic.current)
  
    //           isDoneProcessArrItem.current = true;  // agar tidak masuk ke sini lagi

    //           if (scrollWidth_Container > clientWidth_Container) {
    //               let temp_arrItem = [...arrItem];
    //               let prev_item = [...arrItem];
    //               let next_item = [...arrItem];
  
    //               let final_arrItem = prev_item.concat([...temp_arrItem]).concat([...next_item]);
    //               setArrItem([...final_arrItem]);
  
    //               console.log("final_arrItem")
    //               console.log(final_arrItem)
    //           }
                
    //           clearInterval(interval);

    //         }
    //     },100)

    //   }
    //   else {
    //     // alert('masuk')
    //   }

    //   return () => clearInterval(interval);

    // },[arrItem])

    useEffect(()=>{

      // Styling Button Prev dan Next
      let intervalButton = setInterval(()=>{
        let buttonNext = buttonNextRef.current;
        let buttonPrev = buttonPrevRef.current;
        if (buttonNext && buttonPrev){
          buttonNext.style.setProperty('border-radius','50%','important');
          buttonPrev.style.setProperty('border-radius','50%','important');
          clearInterval(intervalButton);
        }
      });

      let interval = setInterval(()=>{
          // let containerNew = containerNewRef.current;
          let containerNew = subContainerNewRef.current;
          let arrNew = arrNewRef.current[data.length-1];
          
          if (containerNew && arrNew){

            let counter = 0;
            let total_client_width = 0; // untuk mengatur width subcontainer

            arrNewRef.current.forEach((item, idx)=>{

              let widthItem = item.clientWidth;

              total_client_width += widthItem;  // total client width semua element

              // let posisi = counter - 70;
              let posisi = counter;
              
              item.style.transform = `translateX(${posisi}px)`;
              
              let get_attr_idx = item.getAttribute('data-attr-idx');
              // let get_attr_idx = item.dataset.idx;  // di attribute html div harus 'data-idx'
              objTransformRef.current = {
                ...objTransformRef.current,
                [parseFloat(get_attr_idx)]: posisi
              }

              // console.log("Attribute " + idx + " : " + get_attr_idx)

              counter += widthItem;
            })

            // console.log("objTransformRef")
            // console.log(objTransformRef.current)

            // * Atur lebar Sub Container
            if (containerNew){
              let parentSubCont = containerNew.parentNode;
              
              // jika lebar parent subcont lebih besar dari subcont, maka lebar subcont diatur sama seperti total clientWidth element nya.
              if (total_client_width < parentSubCont.clientWidth){
                setWidthSubContainer(total_client_width + 'px');
              }
              else if (total_client_width >= parentSubCont.clientWidth){
                setWidthSubContainer('100%');
              }
            }

            // let contClientRect = subContainerNewRef.current.getBoundingClientRect();
            // console.log("Sub Cont Bounding ClientRect : ", contClientRect);

            // arrNewRef.current.forEach((item, idx)=>{
            //   let itemClientRect = item.getBoundingClientRect();
              // console.log("itemClientRect " + idx + " : ", itemClientRect);
            // });

            clearInterval(interval);
          }
      },100)


      const handleResize = () => {

        let total_client_width = 0;

        arrNewRef.current.forEach((item, idx)=>{

          let widthItem = item.clientWidth;

          total_client_width += widthItem;  // total client width semua element
        });

        let containerNew = subContainerNewRef.current;
         // * Atur lebar Sub Container
         if (containerNew){
          let parentSubCont = containerNew.parentNode;
          
          // jika lebar parent subcont lebih besar dari subcont, maka lebar subcont diatur sama seperti total clientWidth element nya.
          if (total_client_width < parentSubCont.clientWidth){
            setWidthSubContainer(total_client_width + 'px');
          }
          else if (total_client_width >= parentSubCont.clientWidth){
            setWidthSubContainer('100%');
          }
        }

        
      }

      window.addEventListener('resize', handleResize);

      return () => {
        clearInterval(interval);
        clearInterval(intervalButton);

        window.removeEventListener('resize', handleResize);
      };

    },[])
    
    // useEffect(()=>{
        
        // const interval = setInterval(()=>{

        //   let targetElement = arrRef.current[1];
        //   if (targetElement){
        //     containerRef.current.scrollLeft = targetElement.offsetLeft;

        //     clearInterval(interval);
        //   }
        // }, 100)

        // return () => clearInterval(interval);

    // },[])


    // const handleClick = () => {
    //   console.log(`
    //       Container (Scroll Width) : ${containerRef.current.scrollWidth}
    //       (client Width) : ${containerRef.current.clientWidth}
    //     `)

    //   arrRef.current.forEach((item, index)=>{
    //     if (item){
    //       console.log(`Item : ${index}, Offset Left : ${item.offsetLeft},
    //           Offset Width : ${item.offsetWidth}`)
    //     }
    //   })

    //   // setArrItem(prev=>{
    //   //   let temp = [...prev];
    //   //   temp.splice(0, data.length);
    //   //   console.log(temp);
    //   //   return [...temp];
    //   // })
    //   // containerRef.current.scrollLeft = 0;
    // }

    // const handleScrollContainer = () => {

    //   let containerElement = containerRef.current;
    //   if (containerElement){

    //       let scrollWidth_Container = containerRef.current.scrollWidth;
    //       let clientWidth_Container = containerRef.current.clientWidth;
    //       let scrollLeft_Container = containerRef.current.scrollLeft;
          
    //       let lastElement = arrRef.current[arrRef.current.length-1];
    //       let lastElement_offsetWidth = lastElement.offsetWidth;

    //       let threshold = scrollWidth_Container - clientWidth_Container - (lastElement_offsetWidth * 1.5);
    //       if (scrollLeft_Container > threshold){
    //           console.log('Mencapai Maks');
              
    //           // ** cara geser scroll (x)
    //           // containerRef.current.scrollLeft -= clientWidth_Basic.current + 50;

    //           let temp_arrItem = [...arrItem];
    //           let gabung_data = temp_arrItem.concat([...data]);
    //           gabung_data.splice(0, data.length);
              
    //           // temp_arrItem.splice(data.length, data.length);
              
    //           // let final_arrItem = [...gabung_data];
    //           console.log(gabung_data)
              
    //           setArrItem([...gabung_data]);

    //           // temp_arrItem = temp_arrItem.concat([...data])
    //           // setArrItem([...temp_arrItem]);
              
    //           // console.log(final_arrItem)

    //           console.log("\nscrollLeft_Container : ", scrollLeft_Container);
    //           console.log("threshold : ", threshold);
    //           console.log("lastElement_offsetWidth : ", lastElement_offsetWidth);
    //       }

    //   }
    // }

    const handle_mergeClickDown_NewCont = (client_x:number) => {
      isNewDragging.current = true;
      startXNew.current = client_x;

      startXNew_ForItemClick.current = client_x;  // untuk click item bukan drag
      // console.log("MOUSE DOWN (startXNew_ForItemClick)")
      // console.log(client_x)
    }

    const handle_mergeClickMove_NewCont = (client_x:number) => {
      
      if (!isNewDragging.current) return;
      
      // let posisiX_Current = e.clientX;
      let posisiX_Current = client_x;
      
      // startXNew_ForItemClick.current = client_x - startXNew_ForItemClick.current;
      // console.log("MOUSE MOVE (selisih) : " + startXNew_ForItemClick.current)

      let deltaX = posisiX_Current - startXNew.current;
      
      if (isDoneProcessMouseMove.current) {

        isDoneProcessMouseMove.current = false;

        let subContainerRect = subContainerNewRef.current.getBoundingClientRect();

        if (Math.sign(deltaX) === -1 
            // && deltaX >= -10 && deltaX < 0
        ){
          // console.log("deltaX : " + deltaX)
          // drag ke kiri
  
          arrNewRef.current.forEach((item, index)=>{
            let getAttrIdx = item.getAttribute('data-attr-idx');
            let getPosisiCurrent = objTransformRef.current[getAttrIdx];
            let deltaPosisi = getPosisiCurrent + deltaX;

            item.style.transform = `translateX(${deltaPosisi}px)`;
            
            objTransformRef.current = {
              ...objTransformRef.current,
              [parseFloat(getAttrIdx)]: deltaPosisi
            }
            // console.log("getPosisiCurrent");
            // console.log(getPosisiCurrent);
          });
  
          // console.error("Testing");
          // console.log("Sub Container Client Width : " + subContainerRect.right);
          // console.log("bounding client rect item last right : " + arrNewRef.current[arrNewRef.current.length-1].getBoundingClientRect().right);

          // let counterPosition:number = subContainerCurr.clientWidth-5;
  
          let arrSmallToBig = Object.keys(objTransformRef.current).map(item=>parseFloat(item)).sort((a,b)=>a-b)
          // arrSmallToBig.forEach((item, index)=>{
          for (let i=0; i<arrSmallToBig.length; i++){

            let item = arrSmallToBig?.[i];
            // console.log(item)
            // periksa element yang melewati batas container dari sisi kiri
            let boundClientRect = arrNewRef.current[item].getBoundingClientRect();
  
            // console.error(item);
            //   console.log(boundClientRect)
            //   console.log("subContainerRect")
            //   console.log(subContainerRect)

            if (boundClientRect.left < subContainerRect.left && 
                (boundClientRect.right-5) < subContainerRect.left
            ){

              
              let element_curr = arrNewRef.current[item].getAttribute("data-attr-idx");

              let element_prev = (parseFloat(element_curr) - 1 + arrNewRef.current.length) % arrNewRef.current.length;  // satu element sebelumnya, jika minus maka dapat element terakhir
              let element_prev_posisi_x = objTransformRef.current[element_prev]; // ambil posisi translateX saat ini
              let element_prev_client_width = arrNewRef.current[element_prev].clientWidth;  // lebar element
              let element_prev_total_x = element_prev_posisi_x + element_prev_client_width; // acuan posisi untuk translateX

              // pindahkan ke ujung kanan
              // arrNewRef.current[item].style.transform = `translateX(${counterPosition}px)`;
              arrNewRef.current[item].style.transform = `translateX(${element_prev_total_x}px)`;
  
              objTransformRef.current = {
                ...objTransformRef.current,
                [item]: element_prev_total_x
                // [item]: counterPosition
              }
  
              // console.log("Item " + item + " : " + boundClientRect.right + " , Sub Container Left : " + subContainerRect.left)
    
              // counterPosition += arrNewRef.current[item].clientWidth;
            }
          // })
          }
  
          // arrNewRef.current[0].style.transform = `translateX(${subContainerRect.right}px)`;
  
          // update ke posisi sekarang
          startXNew.current = posisiX_Current;
  
        }
        else if (Math.sign(deltaX) === 1){

          // gerakan maju semua element terlebih dahulu ke kanan
          arrNewRef.current.forEach((item, index)=>{
            let getAttrIdx = item.getAttribute('data-attr-idx');
            let getPosisiCurrent = objTransformRef.current[getAttrIdx];
            let deltaPosisi = getPosisiCurrent + deltaX;

            item.style.transform = `translateX(${deltaPosisi}px)`;
            
            objTransformRef.current = {
              ...objTransformRef.current,
              [parseFloat(getAttrIdx)]: deltaPosisi
            }
          });

          // urutkan index dari besar ke kecil
          let arrBigToSmall = Object.keys(objTransformRef.current).map(item=>parseFloat(item)).sort((a,b)=>b-a);
          
          for (let i=arrBigToSmall.length-1; i>=0; i--){

              let item = arrBigToSmall?.[i];

              let boundClientRect = arrNewRef.current[item].getBoundingClientRect();
              // console.error(item);
              // console.log(boundClientRect)
              // console.log("subContainerRect")
              // console.log(subContainerRect)

              if ((boundClientRect.left+5) > subContainerRect.right && 
                boundClientRect.right > subContainerRect.right
              ){

                let element_curr = arrNewRef.current[item].getAttribute("data-attr-idx");

                let element_next = (parseFloat(element_curr) + 1) % arrNewRef.current.length;  // satu element setelahnya, untuk di tempatkan ke awal
                let element_next_posisi_x = objTransformRef.current[element_next]; // ambil posisi translateX saat ini yang next
                let element_curr_client_width = arrNewRef.current[item].clientWidth;  // lebar element
                let element_next_total_x = element_next_posisi_x - element_curr_client_width; // acuan posisi untuk translateX
                
                
                // pindahkan ke ujung kiri
                arrNewRef.current[item].style.transform = `translateX(${element_next_total_x}px)`;
                
                objTransformRef.current = {
                  ...objTransformRef.current,
                  [item]: element_next_total_x
                }

              }

          }

          // update ke posisi sekarang
          startXNew.current = posisiX_Current;
          

        }

        isDoneProcessMouseMove.current = true;
        
      }
    }

    const handle_mergeClickUp_NewCont = () => {
      // startXNew_ForItemClick.current = 0;

      isNewDragging.current = false;
      isDoneProcessMouseMove.current = true;
      subContainerNewRef.current.style.pointerEvents = "auto";
    }

    const handle_TouchStart_NewCont = (e:React.TouchEvent) => {
      // for Mobile
      // e.preventDefault();
      handle_mergeClickDown_NewCont(e.touches[0].clientX);
    }

    const handle_TouchMove_NewCont = (e:React.TouchEvent) => {
      // for Mobile
      handle_mergeClickMove_NewCont(e.touches[0].clientX);
    }
    
    const handle_TouchUp_NewCont = (e) => {
      // for Mobile
      handle_mergeClickUp_NewCont();
    }

    
    const handle_MouseDown_NewCont = (e) => {
      // Versi Web
      e.preventDefault();
      // console.error("Click Container")
      handle_mergeClickDown_NewCont(e.clientX);
      // // subContainerNewRef.current.style.pointerEvents = "none";
    }
    
    const handle_MouseMove_NewCont = (e) => {
      // Versi Web
      e.preventDefault();
      // console.log(e.movementX)
      handle_mergeClickMove_NewCont(e.clientX);
    }

    const handle_MouseUp_NewCont = (e) => {
      // Versi Web

      // console.error("---MOUSE UP---")
      // if (e.clientX === startXNew_ForItemClick.current){
        // startXNew_ForItemClick.current = e.clientX - startXNew_ForItemClick.current;
        
        // console.log("MOUSE UP (startXNew_ForItemClick)")
        // console.log(e.clientX)
      // }

      handle_mergeClickUp_NewCont();
      
    }

    const handleClickItem = (e,item) => {
      e.preventDefault();
      if (!isNewDragging.current){
        
        // ** menghitung jarak toleransi klik yang mungkin sedang bergeser (move)
        // *** toleransi yang di mungkinkan yaitu range dari -3 s/d 3 (dianggap klik)
        let selisih:number = e.clientX - startXNew_ForItemClick.current;

        if (selisih >= -3 && selisih <= 3) {
          // alert(item)
          outputClick(item);

          // console.error("click ITEM : " + item)
          // console.error(e.clientX)
          // console.error("startXNew_ForItemClick.current")
          // console.error(startXNew_ForItemClick.current)
        }
        else {
          // console.error("item " + item + "e.clientX === startXNew_ForItemClick.current : " + (e.clientX - startXNew_ForItemClick.current))
        }

      }
    }

    const handleClick_PrevButton = () => {

      if (arrNewRef.current.length > 0){

        arrNewRef.current.forEach((item, index)=>{
          let getAttrIdx = item.getAttribute('data-attr-idx');
          let getPosisiCurrent = objTransformRef.current[getAttrIdx];
          let deltaPosisi = getPosisiCurrent + 30;

          item.style.transform = `translateX(${deltaPosisi}px)`;
          
          objTransformRef.current = {
            ...objTransformRef.current,
            [parseFloat(getAttrIdx)]: deltaPosisi
          }
        });

        let subContainerRect = subContainerNewRef.current.getBoundingClientRect();

        // urutkan index dari besar ke kecil
        let arrBigToSmall = Object.keys(objTransformRef.current).map(item=>parseFloat(item)).sort((a,b)=>b-a);
        
        for (let i=arrBigToSmall.length-1; i>=0; i--){

          let item = arrBigToSmall?.[i];
          let boundClientRect = arrNewRef.current[item].getBoundingClientRect();

          
          if ((boundClientRect.left+5) > subContainerRect.right && 
            boundClientRect.right > subContainerRect.right
          ){

            let element_curr = arrNewRef.current[item].getAttribute("data-attr-idx");

            let element_next = (parseFloat(element_curr) + 1) % arrNewRef.current.length;  // satu element setelahnya, untuk di tempatkan ke awal
            let element_next_posisi_x = objTransformRef.current[element_next]; // ambil posisi translateX saat ini yang next
            let element_curr_client_width = arrNewRef.current[item].clientWidth;  // lebar element
            let element_next_total_x = element_next_posisi_x - element_curr_client_width; // acuan posisi untuk translateX
            
            
            // pindahkan ke ujung kiri
            arrNewRef.current[item].style.transform = `translateX(${element_next_total_x}px)`;
            
            objTransformRef.current = {
              ...objTransformRef.current,
              [item]: element_next_total_x
            }

          }

        }



      }
    }

    const handleClick_NextButton = () => {

      if (arrNewRef.current.length > 0){
        arrNewRef.current.forEach((item, index)=>{
          let getAttrIdx = item.getAttribute('data-attr-idx');
          let getPosisiCurrent = objTransformRef.current[getAttrIdx];
          // let getClientWidth = item.clientWidth;
          let deltaPosisi = getPosisiCurrent - 30;

          item.style.transform = `translateX(${deltaPosisi}px)`;
            
          objTransformRef.current = {
            ...objTransformRef.current,
            [parseFloat(getAttrIdx)]: deltaPosisi
          }

        })

        let subContainerRect = subContainerNewRef.current.getBoundingClientRect();

        let arrSmallToBig = Object.keys(objTransformRef.current).map(item=>parseFloat(item)).sort((a,b)=>a-b);
        for (let i=0; i<arrSmallToBig.length; i++){

            let item = arrSmallToBig?.[i];
            // periksa element yang melewati batas container dari sisi kiri
            let boundClientRect = arrNewRef.current[item].getBoundingClientRect();

            if (boundClientRect.left < subContainerRect.left && 
                (boundClientRect.right-5) < subContainerRect.left
            ){

                let element_curr = arrNewRef.current[item].getAttribute("data-attr-idx");

                let element_prev = (parseFloat(element_curr) - 1 + arrNewRef.current.length) % arrNewRef.current.length;  // satu element sebelumnya, jika minus maka dapat element terakhir
                let element_prev_posisi_x = objTransformRef.current[element_prev]; // ambil posisi translateX saat ini
                let element_prev_client_width = arrNewRef.current[element_prev].clientWidth;  // lebar element
                let element_prev_total_x = element_prev_posisi_x + element_prev_client_width; // acuan posisi untuk translateX

                // pindahkan ke ujung kanan
                // arrNewRef.current[item].style.transform = `translateX(${counterPosition}px)`;
                arrNewRef.current[item].style.transform = `translateX(${element_prev_total_x}px)`;
    
                objTransformRef.current = {
                  ...objTransformRef.current,
                  [item]: element_prev_total_x
                  // [item]: counterPosition
                }

            }
        }
      }

    }

    return (
      <>
        {/* <div
          ref={containerRef}

          style={{
            width:'300px',
            height:'auto',
            border:'1px solid lightblue',
            overflow:'auto',
            whiteSpace:'nowrap',
            fontFamily:'Nunito',
            color:'darkolivegreen',
            fontWeight:800,
            scrollBehavior:'smooth',
            transition:'scroll-left 5.5s ease-in-out'
          }}

          onScroll={handleScrollContainer}
        >

          {[...Array(3)].map((_, index)=>(
          {[...arrItem].map((item, index)=>(
            <div
              key={index}
              className="align-items-center justify-content-center"
              ref={(el)=>arrRef.current[index] = el}
              style={{
                width:'auto',
                height:'50px',
                border:'1px solid lightblue',
                display:'inline-flex',
                padding:'5px'
              }}
            >

                <div
                  style={{
                    backgroundColor:'lightgray',
                    padding:'4px 8px',
                    borderRadius:'10px'
                  }}
                >
                    {item}
                </div>
            </div>
          ))}

        </div>

          <Button  label="Testing" severity="info" outlined raised onClick={handleClick} /> */}

          <div className="d-flex align-items-center" style={{position:'relative'
                    , height:'50px'
                    // , width:'100%'
                    , width: `${widthSubContainer}`
                    // , border:'1px solid red'
                    , overflow:'hidden'
                    }}
                  ref={subContainerNewRef}
                  onTouchStart={handle_TouchStart_NewCont}
                  onTouchMove={handle_TouchMove_NewCont}
                  onTouchEnd={handle_TouchUp_NewCont}

                  onMouseDown={handle_MouseDown_NewCont}
                  onMouseMove={handle_MouseMove_NewCont}
                  onMouseUp={handle_MouseUp_NewCont}
                  onMouseLeave={handle_MouseUp_NewCont}
                  // onBlur={handle_MouseUp_NewCont}
            >

              {/* Button Prev */}
              <div
                style={{
                  position:'absolute',
                  background:'linear-gradient(to right, white 50%, #ffffff61 90%)',
                  borderRadius:'30%',
                  height:'35px',
                  width:'70px',
                  top:'50%',
                  left:0,
                  zIndex:1,
                  transform:'translateY(-50%)'
                }}
                className="d-flex align-items-center justify-content-start"
              >
                  <Button outlined icon={<NavigateBefore />}
                    ref={buttonPrevRef}
                    style={{
                      width:'30px',
                      height:'30px',
                      zIndex:1,
                      // backgroundColor:'white',
                      color:'darkcyan'
                    }}
                    onClick={handleClick_PrevButton}
                  />
              </div>

              {/* Button Next */}
              <div
                style={{
                  position:'absolute',
                  background:'linear-gradient(to left, white 50%, #ffffff61 90%)',
                  borderRadius:'30%',
                  height:'35px',
                  width:'70px',
                  top:'50%',
                  right:0,
                  zIndex:1,
                  transform:'translateY(-50%)'
                }}
                className="d-flex align-items-center justify-content-end"
              >
                  <Button outlined icon={<NavigateNext />}
                    ref={buttonNextRef}
                    style={{
                      width:'30px',
                      height:'30px',
                      zIndex:1,
                      // backgroundColor:'white',
                      color:'darkcyan'
                    }}
                    onClick={handleClick_NextButton}
                  />
              </div>
                
                {
                  // [...Array(10)].map((item, idx)=>{

                  data.map((item, idx)=>{
                    return (
                      <div
                        key={`inf-sli-key-${idx}`}
                        ref={(el)=>arrNewRef.current[idx] = el}
                        className="py-2"
                        style={{
                          // border:'1px solid blue',
                          position:'absolute',
                          paddingInline:'5px',
                          whiteSpace:'nowrap'
                        }}
                        data-attr-idx={idx}
                      >
                          <div
                            style={{
                              borderRadius:'10px',
                              paddingInline:'7px',
                              paddingBlock:'3px',
                              cursor:'pointer',
                              userSelect:'none',
                              fontFamily:'Nunito',
                              fontSize:'14px',
                              fontWeight:700
                            }}
                            
                            className="inf-sli-item"
                            onClick={(e)=>handleClickItem(e,item)}
                          >
                            {item}
                          </div>  
                      </div>
                    )
                  })
                }
          </div>


          {/* <div
            style={{
              position:'relative',
              height:'50px'
            }}
            className="bg-info"
          >
              <div
                ref={containerNewRef}
                style={{
                  border:'1px solid red',
                  height:'inherit'
                  // marginLeft:'auto',
                  // marginRight:'auto',
                }}
                className="d-flex"
                    //align-items-center justify-content-center"
              >
                  <div className="flex-grow-1"></div>

                  satu div di sini adalah Sub Container Ref 

                  <div className="flex-grow-1"></div>
                  
              </div>

          </div> */}

          <style>
            {`
              .inf-sli-item {

                background-color:`+ `#e9e7e7` +`;

                &:hover {
                  background-color:mediumvioletred;
                  color:white;
                }
              }
            `}
            
          </style>
          
      </>
    )
};

export default InfiniteSlider;

// const [currentIndex, setCurrentIndex] = useState(1);
// const [isDragging, setIsDragging] = useState(false);
// const [isTransitioning, setIsTransitioning] = useState(false);
// const sliderRef = useRef<HTMLDivElement | null>(null);
// const startX = useRef(0);
// const deltaX = useRef(0);
// const translateX = useRef(0); // Track the translateX value during drag

  // const handleMouseDown = (e: React.MouseEvent) => {
  //   startX.current = e.clientX;
  //   deltaX.current = 0;
  //   setIsDragging(true);
  //   setIsTransitioning(false); // Disable transitions during drag
  // };

  // const handleMouseMove = (e: React.MouseEvent) => {
  //   if (!isDragging) return;
  //   deltaX.current = e.clientX - startX.current;
  //   // translateX.current = -100 + (deltaX.current / 300) * 100; // Adjust translateX in percentage
  //   translateX.current = (deltaX.current * 1.5); // Adjust translateX in percentage
  //   if (sliderRef.current) {
  //     sliderRef.current.style.transform = `translateX(${translateX.current}%)`;
  //   }
  // };

  // const handleMouseUp = () => {
  //   if (!isDragging) return;
  //   setIsDragging(false);

  //   if (deltaX.current < -50) {
  //     // Geser ke kiri (next)
  //     setCurrentIndex((prev) => (prev + 1) % images.length);
  //   } else if (deltaX.current > 50) {
  //     // Geser ke kanan (prev)
  //     setCurrentIndex((prev) =>
  //       (prev - 1 + images.length) % images.length
  //     );
  //   }

  //   deltaX.current = 0; // Reset deltaX after determining movement
  //   setIsTransitioning(true); // Enable smooth transition
  // };

  // const handleTransitionEnd = () => {
  //   setIsTransitioning(false);
  // };

  // const getVisibleImages = () => {
  //   // Dynamically reorder images for infinite loop effect
  //   const reorderedImages = [
  //     images[(currentIndex + images.length - 1) % images.length], // Image sebelum current
  //     images[currentIndex % images.length], // Current image
  //     images[(currentIndex + 1) % images.length], // Image setelah current
  //   ];
    
  //   return reorderedImages;
  // };

  // const visibleImages = getVisibleImages();

  // return (
  //   <div
  //     style={{
  //       // overflow: "hidden",
  //       width: "900px", // 300px per gambar, untuk 3 gambar
  //       height: "200px",
  //       position: "relative",
  //     }}
  //     onMouseDown={handleMouseDown}
  //     onMouseMove={handleMouseMove}
  //     onMouseUp={handleMouseUp}
  //     onMouseLeave={handleMouseUp} // Handle when dragging out of bounds
  //   >
      
  //     <div
  //       ref={sliderRef}
  //       style={{
  //         display: "flex",
  //         width: "300%",
  //         transform: `translateX(0%)`, // Selalu tampilkan gambar tengah
  //         transition: isTransitioning ? "transform 0.3s ease" : "none",
  //       }}
  //       onTransitionEnd={handleTransitionEnd}
  //     >
  //       {/* <div>halo</div> */}
  //       {visibleImages.map((src, index) => (
            
  //         <img
  //           key={index}
  //           src={src}
  //           alt={`Slide ${index}`}
  //           style={{
  //             width: "300px",
  //             height: "200px",
  //             flexShrink: 0,
  //           }}
  //         />
  //       ))}
  //     </div>
  //   </div>
  // );
