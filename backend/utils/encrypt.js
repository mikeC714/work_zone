import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

function encrypt(text){
    const iv = crypto.randomBytes(process.env.IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(process.env.ENCRYPT_KEY));
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

function decrypt(text){
    const [iv, cipher] = text.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(process.env.ENCRYPT_KEY));
    return Buffer.concat([decipher.update(Buffer.from(encrypted, "hex")), decipher.final()]).toString();
};

export {
    encrypt,
    decrypt
}