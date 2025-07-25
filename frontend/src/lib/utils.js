export function formatMessageTime(date){
    return new Date(date).toLocaleDateString("en-us",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false
    })
}