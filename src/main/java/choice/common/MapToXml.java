package choice.common;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.dom4j.Element;

/**
 * 描述:将Map转换成XML
 * 作者:马振
 * 时间:2016年9月5日下午5:04:45
 */
public class MapToXml {
	public Element maptoxml(Map map, Element element){
		Set set = map.entrySet();
		Iterator iterator = set.iterator();
		while (iterator.hasNext()) {
		      Map.Entry entry = (Map.Entry) iterator.next();
		      Element ele = element.addElement(entry.getKey().toString());
		      ele.setText(null == entry.getValue() ? "" : entry.getValue().toString());
		}
		return element;
	}
}