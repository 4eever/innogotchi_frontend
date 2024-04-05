export const domen = 'innogotchi.somee.com';

export function createBase64FromImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result.split(',')[1];
            resolve(base64Image);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}   