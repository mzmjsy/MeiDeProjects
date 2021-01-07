package choice.common;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

public class ResourceMap {

	private Properties properties;
	
	private String canonicalName = "";
	
	
	public ResourceMap(final Class<String> clazz){
		
		properties = new Properties();
		try {
			canonicalName = clazz.getSimpleName()+".properties";
			InputStream in = new FileInputStream(canonicalName);
			
			properties.load(new InputStreamReader(in,"UTF-8"));
			in.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public ResourceMap(final String path){
		
		properties = new Properties();
		try {
			canonicalName = path+".properties";
			InputStream in = new FileInputStream(canonicalName);
			
			properties.load(new InputStreamReader(in,"UTF-8"));
			in.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public String getString(String key){
		
		String value = "";
		
		if(properties.getProperty(key)!=null && !properties.getProperty(key).trim().equals("")){
			value = properties.getProperty(key);
		}
		return value;
	}

	public String setString(String path,String key,String value){
		
		if("".equals(value) || null==value){//  如果传入时间为空value，则new 一个时间
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			value = sdf.format(new Date());
		}
		properties.setProperty(key, value); 
		
		OutputStream fos = null;
		try {
			canonicalName = path+".properties";
			fos = new FileOutputStream(canonicalName);
			properties.store(new OutputStreamWriter(fos,"UTF-8"),null); 
			//fos.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		finally {   
          if (fos != null) {
            try {   
                  fos.flush();   
                  fos.close();   
              } catch (IOException e) {  
            	  if(properties!=null)
            	  {
            		  properties.clear();  
            	  }
               } finally {   
                  fos = null;   
               }   
          }   
        }   

		return value;
	}
}
