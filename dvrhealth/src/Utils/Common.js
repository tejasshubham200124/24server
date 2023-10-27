export const getUserId = () => {
    const userStr = localStorage.getItem('id');
    if (userStr !== null && userStr !== undefined) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        
        return null;
      }
    } else {
      return null;
    }
  };


  export const setUserSession = (id) => {
    localStorage.setItem('id', JSON.stringify(id));
   
  }
  export const removeUserSession = () => {
    localStorage.removeItem('id');   
  }