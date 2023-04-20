
const imageURL = require('./Avid Traveler.png');
const baseUrl = window.location.origin;
const finalImageUrl = baseUrl + imageURL;

console.log(baseUrl,imageURL.default);



// export default {
//     [`Avid Traveler`]: new URL('./Avid Traveler.png', import.meta.url).href,
//     [`Fitness Freak`]: new URL('./Fitness Freak.png', import.meta.url).href,
//     [`Foodie`]: new URL('./Foodie.png', import.meta.url).href,
//     [`Sports Fan`]: new URL('./Sports Fan.png', import.meta.url).href,
//     [`Techie`]: new URL('./Techie.png', import.meta.url).href,
// }

export default {
    [`Avid Traveler`]: "",
    [`Fitness Freak`]: "",
    [`Foodie`]:"",
    [`Sports Fan`]: "",
    [`Techie`]:"",
}
