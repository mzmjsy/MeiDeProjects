package choice.timing.general;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.concurrent.*;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import choice.common.ItemPath;
import choice.common.ResourceMap;
import choice.timing.trans.AutoTransData;

/**
 * @author 马振
 */
public class GeneralServlet extends HttpServlet{

	private static final long serialVersionUID = 2480214466977080695L;
	
	public Thread thread;
	
	ResourceMap rm = new ResourceMap(ItemPath.getItemPath() + "time");
	
	/**
	 * 初始化
	 */
	@Override
	public void init() throws ServletException{
		transImsToYc();
	}

	/**
	 * 处理GET请求
	 */
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,IOException{
		doPost(request, response);
	}

	/**
	 * 处理POST请求
	 */
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,IOException{
		
		RequestDispatcher requestDispatcher = request.getRequestDispatcher("/jsp/index.jsp");   
		requestDispatcher.forward(request, response);
	}
	
	/**
	 * 销毁实例
	 */
	@Override
	public void destroy(){
		super.destroy();
	}

	/**
	 * IMS数据传到玫德雅昌
	 */
	public void transImsToYc(){
		thread = new Thread(){
			@Override
			public void run(){
			do{
				new AutoTransData().transImsToDst();

				//间隔时间
				int time = Integer.parseInt(rm.getString("time"));
				try {
					Thread.sleep(1000 * 60 * time);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}while(true);
			}
		};
		thread.start();
	}

	public void yesornoauto(HttpServletRequest request, HttpServletResponse response){
		try {
			request.setCharacterEncoding("utf-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
}