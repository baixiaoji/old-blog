/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let otherSideArray = nums.map(val => target-val);
   const arr = [];
    nums.forEach((val,index) => {
        if(arr.includes(index)){
          return;
        }
        const idx1 = otherSideArray.indexOf(val);        
        if(~idx1){
            const idx2 =  otherSideArray.indexOf(target-val,idx1+1)
            
            if(~idx2){
              
              arr.push(idx1,idx2)
       
            }
            
        }
       
    })
    
    return arr
};
