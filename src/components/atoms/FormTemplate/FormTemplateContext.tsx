import React, { createContext, useEffect, useMemo, useState } from 'react'

export interface FormTemplateContextInterface{
  dataContext:any;
  setDataContext:React.Dispatch<React.SetStateAction<any>>;
}

export const FormTemplateContext = createContext<FormTemplateContextInterface>({
  dataContext:null,
  setDataContext:()=>{}
});
// export const FormTemplateContext = createContext<any>({});

const FormTemplateContextProv = ({children}) => {
  const [dataContext, setDataContext] = useState<any>(null);

  useEffect(()=>{
    // alert(JSON.stringify(dataContext,null,2))
  },[dataContext])

  return (
    <FormTemplateContext.Provider value={{ dataContext, setDataContext }}>
        {children}
    </FormTemplateContext.Provider> 
  )
}

export default FormTemplateContextProv