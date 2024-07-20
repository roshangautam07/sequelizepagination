function isNestedArrayWithOrder(array) {
    // Check if the array is indeed an array
    if (!Array.isArray(array)) {
      return false;
    }
  
    // Iterate over each element of the array
    for (let i = 0; i < array.length; i++) {
      const innerArray = array[i];
  
      // Check if the current element is an array
      if (!Array.isArray(innerArray)) {
        return false;
      }
  
      // Check if the first element of the inner array is a string (e.g., the name)
      if (typeof innerArray[0] !== 'string') {
        return false;
      }
  
      // Check if the second element is either 'ASC' or 'DESC'
      if (innerArray.length > 1 && innerArray[1] !== 'ASC' && innerArray[1] !== 'DESC') {
        return false;
      }
  
      // Default the second element to 'ASC' if not provided
      if (innerArray.length === 1) {
        innerArray.push('ASC');
      }
    }
  
    return true;
  }
  function isArrayofObjects(arr) {
    if (!Array.isArray(arr)) {
        return false;
    }
    return arr.every(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            return true;
        }
        if (Array.isArray(item)) {
            return isArrayofObjects(item);
        }
        return false;
    });
}

  module.exports = {isNestedArrayWithOrder,isArrayofObjects};