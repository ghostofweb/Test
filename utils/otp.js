function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getExpiry(minutes=5){
    return Date.now() + minutes * 60 * 1000;
}

export {
    generateOtp,
    getExpiry
}