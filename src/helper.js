const colorPallete = [
    "#F05D5E", 
    "#D8A47F",
    "#F5E663",
    "#1C5253",
    "#F18F01",
    "#272932",
    "#94B0DA",
    "#533E2D",
    "#EF8354",
    "#EB5160",
    "#1F2421",
    "#0D1821",
    "#BCD979",
    "#4F6D7A",
    "#A997DF",
    "#090809",
    "#351431",
    "#424651",
    "#F4BBD3"
]

const getRandomColor = () => {
    const number = Math.floor(Math.random() * colorPallete.length);
    return colorPallete[number]
}