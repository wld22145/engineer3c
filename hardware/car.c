#include<AT89x51.H>
	
	#define leftfrontgo {P1_4=1;P1_5=0;}
	#define leftfrontdown {P1_4=0;P1_5=1;}
	#define rightfrontgo {P1_0=1;P1_1=0;}
	#define rightfrontdown {P1_0=0;P1_1=1;}
	#define leftbackgo {P1_2=0;P1_3=1;}
	#define leftbackdown {P1_2=1;P1_3=0;}
	#define rightbackgo {P1_6=1;P1_7=0;}
	#define rightbackdown {P1_6=0;P1_7=1;}
	#define stopall {P1_4=0,P1_5=0,P1_6=0,P1_7=0;P1_0=0,P1_1=0,P1_2=0,P1_3=0;}
	
	
	#define Left_moto_go      {leftfrontgo;leftbackgo;}    //左边两个电机向前走
	#define Left_moto_back    {leftfrontdown;leftbackdown;}    //左边两个电机向后转
	#define Right_moto_go     {rightfrontgo;rightbackgo;}	//右边两个电机向前走
	#define Right_moto_back   {rightfrontdown;rightbackdown;}	//右边两个电机向后走

	
	#define left     'C'
  	#define right    'D'
	#define up       'A'
  	#define down     'B'
	#define stop     'F'

	char code str[] =  "go";
	char code str1[] = "back";
	char code str2[] = "left";
	char code str3[] = "right";
	char code str4[] = "stop";

	bit  flag_REC=0; 
	bit  flag    =0;  
	

	unsigned char  i=0;
	unsigned char  dat=0;
    unsigned char  buff[5]="ONA"; //接收缓冲字节
	

   
/************************************************************************/	
//延时函数	
   void delay(unsigned int k)
{    
     unsigned int x,y;
	 for(x=0;x<k;x++) 
	   for(y=0;y<2000;y++);
}

/************************************************************************/
//字符串发送函数
	  void send_str( )
                   // 传送字串
    {
	    unsigned char i = 0;
	    while(str[i] != '\0')
	   {
		SBUF = str[i];
		while(!TI);				// 等特数据传送
		TI = 0;					// 清除数据传送标志
		i++;					// 下一个字符
	   }	
    }
	
		  void send_str1( )
                   // 传送字串
    {
	    unsigned char i = 0;
	    while(str1[i] != '\0')
	   {
		SBUF = str1[i];
		while(!TI);				// 等特数据传送
		TI = 0;					// 清除数据传送标志
		i++;					// 下一个字符
	   }	
    }	

			  void send_str2( )
                   // 传送字串
    {
	    unsigned char i = 0;
	    while(str2[i] != '\0')
	   {
		SBUF = str2[i];
		while(!TI);				// 等特数据传送
		TI = 0;					// 清除数据传送标志
		i++;					// 下一个字符
	   }	
    }	
	    	
			  void send_str3()
                   // 传送字串
    {
	    unsigned char i = 0;
	    while(str3[i] != '\0')
	   {
		SBUF = str3[i];
		while(!TI);				// 等特数据传送
		TI = 0;					// 清除数据传送标志
		i++;					// 下一个字符
	   }	
    }	

	      void send_str4()
                   // 传送字串
    {
	    unsigned char i = 0;
	    while(str4[i] != '\0')
	   {
		SBUF = str4[i];
		while(!TI);				// 等特数据传送
		TI = 0;					// 清除数据传送标志
		i++;					// 下一个字符
	   }	
    }	
	    	
	    	
/************************************************************************/
//前进
     void  run(void)
{
    
	 Left_moto_go ;   //左电机往前走
	 Right_moto_go ;  //右电机往前走
}



//后退
     void  backrun(void)
{
    
	 Left_moto_back ;   //左电机往前走
	 Right_moto_back ;  //右电机往前走
}

//左转
     void  leftrun(void)
{
    
	 Left_moto_back ;   //左电机往后走
	 Right_moto_go ;  //右电机往前走
}

//右转
     void  rightrun(void)
{
    
	 Left_moto_go ;   //左电机往前走
	 Right_moto_back ;  //右电机往后走
}
//STOP
     void  stoprun(void)
{
    
	 stopall;
}
/************************************************************************/
void sint() interrupt 4	  //中断接收3个字节
{ 
 
    if(RI)	                 //是否接收中断
    {
       RI=0;
       dat=SBUF;
       if(dat=='O'&&(i==0)) //接收数据第一帧
         {
            buff[i]=dat;
            flag=1;        //开始接收数据
         }
       else
      if(flag==1)
     {
      i++;
      buff[i]=dat;
      if(i>=2)
      {i=0;flag=0;flag_REC=1 ;}  // 停止接收
     }
	 }
}
/*********************************************************************/		 
/*--主函数--*/
	void main(void)
{
	TMOD=0x20;  
    TH1=0xFd;  		   //11.0592M晶振，9600波特率
    TL1=0xFd;
    SCON=0x50;  
    PCON=0x00; 
    TR1=1;
	ES=1;   
    EA=1;   
  	
	while(1)							
	{ 
		if(flag_REC==1)				    //
		{
		flag_REC=0;
		if(buff[0]=='O'&&buff[1]=='N')	//第一个字节为O，第二个字节为N，第三个字节为控制码
		switch(buff[2])
			{
		    case up:					    // 前进
			send_str( );
			while (1)
				{
					run();
					delay(1);
					stoprun();
					delay(1);
					if(flag_REC==1)
						break;
				}
			break;
			
		    case down:						// 后退
			send_str1( );
			while (1)
			{
				backrun();
				delay(1);
				stoprun();
				delay(1);
				if(flag_REC==1)
					break;
			}
			break;
			
			
		    case left:						// 左转
			send_str3( );
			while (1)
			{
				leftrun();
				delay(1);
				stoprun();
				delay(1);
				if(flag_REC==1)
					break;
			}
			break;
			
		    case right:						// 右转
			send_str2( );
			while (1)
			{
				rightrun();
				delay(1);
				stoprun();
				delay(1);
				if(flag_REC==1)
					break;

			}
			break;
			
		    case stop:						// 停止
			send_str4( );
			stoprun();
			break;
			}
		}
	     
      	  
					 
	 }
	 
	  

	


	
}	