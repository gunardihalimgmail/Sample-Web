import React, { createContext, useEffect, useMemo, useState } from 'react'

export interface FormTemplateContextInterface{
  // dataContext:any;
  // setDataContext:React.Dispatch<React.SetStateAction<any>>;
  contextActionClick:any;
  setContextActionClick:React.Dispatch<React.SetStateAction<any>>;
  contextShowModal:{[uuid_detail:string]:{show:boolean}};
  setContextShowModal:React.Dispatch<React.SetStateAction<{[uuid_detail:string]:{show:boolean}}>>;
}

export const FormTemplateContext = createContext<FormTemplateContextInterface>(
  {
    // dataContext:null,
    // setDataContext:()=>{},
    contextActionClick:null,
    setContextActionClick:()=>{},
    contextShowModal:{},
    setContextShowModal:()=>{}
  }
);
// export const FormTemplateContext = createContext<any>({});

const FormTemplateContextProv = ({children}) => {
  // const [dataContext, setDataContext] = useState<any>(null);
  const [contextActionClick, setContextActionClick] = useState<any>(null);
  const [contextShowModal, setContextShowModal] = useState<{[uuid:string]:{show:boolean}}>({});

  // useEffect(()=>{
    // alert(JSON.stringify(dataContext,null,2))
  // },[dataContext])

  return (
    <FormTemplateContext.Provider value={{ contextActionClick, setContextActionClick, contextShowModal, setContextShowModal}}>
        {children}
    </FormTemplateContext.Provider> 
  )
}

export default FormTemplateContextProv