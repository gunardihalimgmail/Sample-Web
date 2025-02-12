// contoh ini independent, tidak terintegrasi ke react

const redux = require("redux");
const createStore = redux.createStore;

const initialState = {
    value: 0,
    age: 17
}

// reducer
const rootReducer = (state = initialState, action) => {
    // if (action.type == 'ADD_AGE'){
    //     return {
    //         ...state,
    //         age: state.age + 1
    //     }
    // }
    // if (action.type == 'CHANGE_VALUE'){
    //     return {
    //         ...state,
    //         value: state.value + action.angkabaru
    //     }
    // }

    switch(action.type){
        case 'ADD_AGE':
            return {
                    ...state,
                    age: state.age + 1
                }
        case 'CHANGE_VALUE':
            return {
                    ...state,
                    value: state.value + action.angkabaru,
                }
        default:
            return state;
    }
}

// store
const store = createStore(rootReducer);
console.log(store.getState())

// SUBSCRIBE
store.subscribe(()=>{
    console.log("Store changes : " + JSON.stringify(store.getState()))
})

// dispatch action
store.dispatch({type:'ADD_AGE'})
store.dispatch({type:'CHANGE_VALUE', angkabaru:16 })


console.log(store.getState())
