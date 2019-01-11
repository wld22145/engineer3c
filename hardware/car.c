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
	
	
	#define Left_moto_go      {leftfrontgo;leftbackgo;}    //������������ǰ��
	#define Left_moto_back    {leftfrontdown;leftbackdown;}    //�������������ת
	#define Right_moto_go     {rightfrontgo;rightbackgo;}	//�ұ����������ǰ��
	#define Right_moto_back   {rightfrontdown;rightbackdown;}	//�ұ�������������

	
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
    unsigned char  buff[5]="ONA"; //���ջ����ֽ�
	

   
/************************************************************************/	
//��ʱ����	
   void delay(unsigned int k)
{    
     unsigned int x,y;
	 for(x=0;x<k;x++) 
	   for(y=0;y<2000;y++);
}

/************************************************************************/
//�ַ������ͺ���
	  void send_str( )
                   // �����ִ�
    {
	    unsigned char i = 0;
	    while(str[i] != '\0')
	   {
		SBUF = str[i];
		while(!TI);				// �������ݴ���
		TI = 0;					// ������ݴ��ͱ�־
		i++;					// ��һ���ַ�
	   }	
    }
	
		  void send_str1( )
                   // �����ִ�
    {
	    unsigned char i = 0;
	    while(str1[i] != '\0')
	   {
		SBUF = str1[i];
		while(!TI);				// �������ݴ���
		TI = 0;					// ������ݴ��ͱ�־
		i++;					// ��һ���ַ�
	   }	
    }	

			  void send_str2( )
                   // �����ִ�
    {
	    unsigned char i = 0;
	    while(str2[i] != '\0')
	   {
		SBUF = str2[i];
		while(!TI);				// �������ݴ���
		TI = 0;					// ������ݴ��ͱ�־
		i++;					// ��һ���ַ�
	   }	
    }	
	    	
			  void send_str3()
                   // �����ִ�
    {
	    unsigned char i = 0;
	    while(str3[i] != '\0')
	   {
		SBUF = str3[i];
		while(!TI);				// �������ݴ���
		TI = 0;					// ������ݴ��ͱ�־
		i++;					// ��һ���ַ�
	   }	
    }	

	      void send_str4()
                   // �����ִ�
    {
	    unsigned char i = 0;
	    while(str4[i] != '\0')
	   {
		SBUF = str4[i];
		while(!TI);				// �������ݴ���
		TI = 0;					// ������ݴ��ͱ�־
		i++;					// ��һ���ַ�
	   }	
    }	
	    	
	    	
/************************************************************************/
//ǰ��
     void  run(void)
{
    
	 Left_moto_go ;   //������ǰ��
	 Right_moto_go ;  //�ҵ����ǰ��
}



//����
     void  backrun(void)
{
    
	 Left_moto_back ;   //������ǰ��
	 Right_moto_back ;  //�ҵ����ǰ��
}

//��ת
     void  leftrun(void)
{
    
	 Left_moto_back ;   //����������
	 Right_moto_go ;  //�ҵ����ǰ��
}

//��ת
     void  rightrun(void)
{
    
	 Left_moto_go ;   //������ǰ��
	 Right_moto_back ;  //�ҵ��������
}
//STOP
     void  stoprun(void)
{
    
	 stopall;
}
/************************************************************************/
void sint() interrupt 4	  //�жϽ���3���ֽ�
{ 
 
    if(RI)	                 //�Ƿ�����ж�
    {
       RI=0;
       dat=SBUF;
       if(dat=='O'&&(i==0)) //�������ݵ�һ֡
         {
            buff[i]=dat;
            flag=1;        //��ʼ��������
         }
       else
      if(flag==1)
     {
      i++;
      buff[i]=dat;
      if(i>=2)
      {i=0;flag=0;flag_REC=1 ;}  // ֹͣ����
     }
	 }
}
/*********************************************************************/		 
/*--������--*/
	void main(void)
{
	TMOD=0x20;  
    TH1=0xFd;  		   //11.0592M����9600������
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
		if(buff[0]=='O'&&buff[1]=='N')	//��һ���ֽ�ΪO���ڶ����ֽ�ΪN���������ֽ�Ϊ������
		switch(buff[2])
			{
		    case up:					    // ǰ��
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
			
		    case down:						// ����
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
			
			
		    case left:						// ��ת
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
			
		    case right:						// ��ת
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
			
		    case stop:						// ֹͣ
			send_str4( );
			stoprun();
			break;
			}
		}
	     
      	  
					 
	 }
	 
	  

	


	
}	