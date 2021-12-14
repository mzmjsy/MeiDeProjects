package choice.common;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;

import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

/**
 * @author mz
 */
public class Encryption {
	public static final String KEY_ALGORITHM = "RSA";
	public static final int MAX_ENCRYPT_BLOCK = 117;
	public static final String CHARSET = "UTF-8";

	/**
	 * RSA分段加密
	 * @param body 加密内容
	 * @param publicKey	加密公钥
	 * @return 返回值
	 * @throws Exception 抛出异常
	 */
	public static String encryptByPublicKey(String body, String publicKey) throws Exception {
		byte[] data = body.getBytes(CHARSET);
		byte[] keyBytes = Base64.decodeBase64(publicKey);
		X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		Key publicK = keyFactory.generatePublic(x509KeySpec);
		// 对数据加密
		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
		cipher.init(Cipher.ENCRYPT_MODE, publicK);
		return Base64.encodeBase64String(rsaSplitCodec(cipher, data));
	}

	/**
	 * 通过X509编码的Key指令获得公钥对象
	 * @param publicKey	公钥
	 * @return	公钥对象
	 */
	public static RSAPublicKey getPublicKey(String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		//通过X509编码的Key指令获得公钥对象
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(Base64.decodeBase64(publicKey));
		return (RSAPublicKey) keyFactory.generatePublic(x509KeySpec);
	}

	/**
	 * 公钥加密
	 * @param data	加密对象
	 * @param key	加密公钥
	 * @return	加密后的字符串
	 */
	public static String publicEncrypt(String data, String key){
		try {
			RSAPublicKey publicKey = getPublicKey(key);
			Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, publicKey);
			return Base64.encodeBase64URLSafeString(rsaSplitCodec(cipher, data.getBytes(CHARSET)));
		} catch (Exception e) {
			throw new RuntimeException("加密字符串[" + data + "]时遇到异常", e);
		}
	}

	/**
	 * 公钥加密
	 * @param data		参数
	 * @param publicKey	密钥
	 * @return	返回值
	 */
	public static String publicEncrypt(String data, RSAPublicKey publicKey){
		try {
			Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, publicKey);
			return Base64.encodeBase64URLSafeString(rsaSplitCodec(cipher, Cipher.ENCRYPT_MODE, data.getBytes(CHARSET), publicKey.getModulus().bitLength()));
		} catch (Exception e){
			throw new RuntimeException("加密字符串[" + data + "]时遇到异常", e);
		}
	}

	/**
	 * 分段加密
	 * @param cipher	Cipher
	 * @param data	加密数据
	 * @return	返回密钥
	 */
	private static byte[] rsaSplitCodec(Cipher cipher, byte[] data){
		int inputLen = data.length;
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		int offSet = 0;
		byte[] buff;
		int i = 0;
		try{
			while(inputLen > offSet){
				if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
					buff = cipher.doFinal(data, offSet, MAX_ENCRYPT_BLOCK);
				}else{
					buff = cipher.doFinal(data, offSet, inputLen - offSet);
				}
				out.write(buff, 0, buff.length);
				i++;
				offSet = i * MAX_ENCRYPT_BLOCK;
			}
		} catch (Exception e) {
			throw new RuntimeException("加解密阀值为["+MAX_ENCRYPT_BLOCK+"]的数据时发生异常", e);
		}
		byte[] resultDatas = out.toByteArray();
		IOUtils.closeQuietly(out);
		return resultDatas;
	}

	/**
	 * 分段加密
	 * @param cipher	Cipher
	 * @param data		加密数据
	 * @param keySize	密钥长度
	 * @return	返回密钥
	 */
	private static byte[] rsaSplitCodec(Cipher cipher, int opmode, byte[] data, int keySize){
		int maxBlock = 0;
		if(opmode == Cipher.DECRYPT_MODE){
			maxBlock = keySize / 8;
		}else{
			maxBlock = keySize / 8 - 11;
		}
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		int offSet = 0;
		byte[] buff;
		int i = 0;
		try{
			while(data.length > offSet){
				if(data.length-offSet > maxBlock){
					buff = cipher.doFinal(data, offSet, maxBlock);
				}else{
					buff = cipher.doFinal(data, offSet, data.length-offSet);
				}
				out.write(buff, 0, buff.length);
				i++;
				offSet = i * maxBlock;
			}
		}catch(Exception e){
			throw new RuntimeException("加解密阀值为[" + maxBlock + "]的数据时发生异常", e);
		}
		byte[] resultDatas = out.toByteArray();
		IOUtils.closeQuietly(out);
		return resultDatas;
	}
}