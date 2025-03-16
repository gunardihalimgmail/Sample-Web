import React, { createContext, useEffect, useMemo, useState } from 'react'

type DataOperationTypeEdit = {
  type:'Edit'; id_detail:string; id_row:string; refDataChange:any; refDataEditChange:any;
}
type DataOperationTypeNew = {
  type:'New'; id_detail:string; refDataChange:any; refDataEditChange:any;
}
type DataOperationTypeDelete = {
  type:'Delete'; id_detail:string; id_row:string;
}


export interface FormTemplateContextInterface{
  // dataContext:any;
  // setDataContext:React.Dispatch<React.SetStateAction<any>>;
  contextActionClick:any;
  setContextActionClick:React.Dispatch<React.SetStateAction<any>>;
  contextShowModal:{[uuid_detail:string]:{show:boolean, form?:{type:'Custom',form_custom:React.ReactElement}|{type:'Template'} }};
  setContextShowModal:React.Dispatch<React.SetStateAction<{[uuid_detail:string]:{show:boolean, form?:{type:'Custom',form_custom:React.ReactElement}|{type:'Template'} }}>>;

  contextDataOperation:DataOperationTypeEdit|DataOperationTypeNew|DataOperationTypeDelete|undefined;
  setContextDataOperation:React.Dispatch<React.SetStateAction<DataOperationTypeEdit|DataOperationTypeNew|DataOperationTypeDelete|undefined>>;

}

export const FormTemplateContext = createContext<FormTemplateContextInterface>(
  {
    // dataContext:null,
    // setDataContext:()=>{},
    contextActionClick:null,
    setContextActionClick:()=>{},
    
    contextShowModal:{},
    setContextShowModal:()=>{},

    // contextDataOperation:undefined,
    contextDataOperation:undefined,
    setContextDataOperation:()=>{}
  }
);
// export const FormTemplateContext = createContext<any>({});

const FormTemplateContextProv = ({children}) => {
  // const [dataContext, setDataContext] = useState<any>(null);
  const [contextActionClick, setContextActionClick] = useState<any>(null);
  const [contextShowModal, setContextShowModal] = useState<{[uuid:string]:{show:boolean, form?:{type:'Custom',form_custom:React.ReactElement}|{type:'Template'} }}>({});
  
  const [contextDataOperation, setContextDataOperation] = useState<DataOperationTypeEdit|DataOperationTypeNew|DataOperationTypeDelete|undefined>();

  // useEffect(()=>{
    // alert(JSON.stringify(dataContext,null,2))
  // },[dataContext])

  return (
    <FormTemplateContext.Provider value={{ contextActionClick, setContextActionClick, contextShowModal, setContextShowModal
                                          , contextDataOperation, setContextDataOperation
    }}>
        {children}
    </FormTemplateContext.Provider> 
  )
}

export default FormTemplateContextProv