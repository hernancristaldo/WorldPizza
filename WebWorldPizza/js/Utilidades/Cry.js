// Pasos
//uglifyjs cry.js -o EncrypDecrypt2.js
//npx javascript-obfuscator EncrypDecrypt2.js --output EncrypDecrypt3.js

class ModuloCryptoJS {
    constructor() {
        this._scr = '';
        this.CryptoJS = CryptoJS;
    }
    async _get() {
        const nombre = sessionStorage.getItem("name");
        const number = parseInt(sessionStorage.getItem("number"));
        const clave = nombre + number.toString();
        const claveEncriptacion = this.generateKeyFromData(clave);
        const hexaClave = claveEncriptacion.toString(CryptoJS.enc.Hex);
        return hexaClave.toUpperCase();
    }
    async enc(data) {
        this._scr = await this._get();
        const encryptedData = this.CryptoJS.AES.encrypt(JSON.stringify(data), this._scr).toString();
        return encryptedData;
    }
    async dec(encryptedData) {
        try {
            this._scr = await this._get();
            const bytes = this.CryptoJS.AES.decrypt(encryptedData, this._scr);
            const decryptedData = JSON.parse(bytes.toString(this.CryptoJS.enc.Utf8));
            return decryptedData;
        }
        catch {
            sessionStorage.clear();
            window.location.href = "/ViewControllers/Login.aspx";
        }
    }
    generateKeyFromData(data) {
        const salt = sessionStorage.getItem("salt");
        const iterations = 1500;
        const key = CryptoJS.PBKDF2(data, salt, {
            keySize: 256 / 32,
            iterations: iterations
        });
        return key;
    }
    async decSer(encryptedText) {
        try {
            const key = CryptoJS.enc.Hex.parse(await this._get());
            const cipherBytes = CryptoJS.enc.Base64.parse(encryptedText);
            const decryptedBytes = CryptoJS.AES.decrypt({ ciphertext: cipherBytes }, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            return decryptedBytes.toString(CryptoJS.enc.Utf8);
        }
        catch {
            sessionStorage.clear();
            window.location.href = "/ViewControllers/Login.aspx";
        }
    }

}

const instanciaModuloCryptoJS = new ModuloCryptoJS();

export default instanciaModuloCryptoJS;