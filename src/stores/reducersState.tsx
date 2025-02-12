import { legacy_createStore as createStore } from "redux"

const initialState:any = {
    menu: {
        type:'menu',
        text: true
    },
    titleicon: {
        type:'titleicon',
        text: ''
    },
    breadcrumbs:{
        type:'breadcrumbs',
        text:[]
    }
}

const menuReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'menu': 
      // set show or hide side menu left
        return {
            ...state,
            menu: {
              ...state.menu,
              text: action.text
            }
        }
    case 'titleicon': 
        // title icon, eg: 'Dashboard'
        return {
            ...state,
            titleicon: {
              ...state.titleicon,
              text: action.text
            }
        }
    case 'breadcrumbs': 
        return {
            ...state,
            breadcrumbs: {
              ...state.breadcrumbs,
              text: Array.isArray(action.text) ? [...action.text] : []
            }
        }
    default:
        return state;
  }
}

export default menuReducer;