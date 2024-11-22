function verifyAttributes(obj) {
    const promise = new Promise((resolve, reject) => {
        const requiredAttributes = [];
        const keys = Object.keys(obj)
        const array = Object.values(obj)
        array.map((ele, index) => {
            if (!ele) {
                requiredAttributes.push(keys[index])
            }
        })
        if (requiredAttributes.length == 0) {
            resolve("Attributes are verified")
        } else {
            reject("Provide Required Attributes " + requiredAttributes);
        }
    })
    return promise;
}

module.exports=verifyAttributes;