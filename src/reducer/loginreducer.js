const initialState = {
    username: null,
    password: null
}

const loginReducer = (state= initialState,action)=>{
if(action.type==="CHANGE_USER"){
   let newstate = {...state};
    newstate.username = action.value;
    return newstate;
}
if(action.type==="CHANGE_PASS"){
  let  newstate = {...state};
    newstate.password = action.value;
    return newstate;
}
else{
    return state
}
}

export default loginReducer;