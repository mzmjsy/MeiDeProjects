package choice.common;

import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

/**
 * 发送邮件
 * @author zhb
 */

public class MailUtils {

	private static final String RECEIVERMAIL = new ResourceMap(ItemPath.getItemPath()+"config").getString("anaemail");// 收件人
	private static final String HOST = "smtp.163.com";// smtp主机
	private static final String MAILNAME = "choice86555486@163.com";
	private static final String MAILPASS = "053186555486";
	private static final String SENDMAIL = new ResourceMap(ItemPath.getItemPath()+"config").getString("sendmail");//是否发送邮件

	public static boolean sendMail(String title,String content,String file) {
		if(SENDMAIL.equals("N")){
			return false;
		}
		
		System.out.println("RECEIVERMAIL====================="+RECEIVERMAIL);

		// 构造mail session

		Properties props = new Properties();

		props.put("mail.smtp.host", HOST);

		props.put("mail.smtp.auth", "true");

		Session session = Session.getDefaultInstance(props,

		new Authenticator() {

			public PasswordAuthentication getPasswordAuthentication() {

				return new PasswordAuthentication(MAILNAME, MAILPASS);

			}

		});

		try {

			// 构造MimeMessage 并设定基本的值

			MimeMessage msg = new MimeMessage(session);

			msg.setFrom(new InternetAddress(MAILNAME));

			msg.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(RECEIVERMAIL));
			msg.getAllRecipients();

			msg.setSubject(title);

			// 构造Multipart

			Multipart mp = new MimeMultipart();

			// 向Multipart添加正文

			MimeBodyPart mbpContent = new MimeBodyPart();

			mbpContent.setContent(content, "text/html;charset=utf8");

			// 向MimeMessage添加（Multipart代表正文）

			mp.addBodyPart(mbpContent);

			// 向Multipart添加附件

			if (null!=file && !file.equals("")) {

				MimeBodyPart mbpFile = new MimeBodyPart();

				FileDataSource fds = new FileDataSource(file);

				mbpFile.setDataHandler(new DataHandler(fds));
				
				mbpFile.setFileName(MimeUtility.encodeText(fds.getName()));

				// 向MimeMessage添加（Multipart代表附件）

				mp.addBodyPart(mbpFile);

			}

			// 向Multipart添加MimeMessage

			msg.setContent(mp);

			msg.setSentDate(new Date());

			msg.saveChanges();

			// 发送邮件

			Transport transport = session.getTransport("smtp");

			transport.connect(HOST, MAILNAME, MAILPASS);

			transport.sendMessage(msg, msg.getAllRecipients());

			transport.close();
		} catch (Exception mex) {

			mex.printStackTrace();
			System.out.println(MAILNAME+"邮件发送失败！");

			return false;

		}
		System.out.println(MAILNAME+"邮件发送成功！");
		return true;

	}
	
	public static void main(String[] args) {
		boolean flag = MailUtils.sendMail("你中奖啦", "王超你中奖了，赶紧请客", "C:\\Users\\DARK\\Desktop\\tomcat-6.0.30\\webapps\\CTF\\uploadfile\\2014-11-22@10211.txt");
		System.out.println(flag);
	}
}
