export const wait = async (delay: number) => new Promise((resolve, _) => {
    setTimeout(resolve, delay);
})