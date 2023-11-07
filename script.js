
window.onload=()=>{
    S=(e)=>{
    return document.querySelector(e);
    }
    var c = S("canvas");
    var canvas =S("canvas");
    var W=innerWidth;c.width =W;
    var H=innerHeight;c.height =H;
    var c = c.getContext("2d");
    var mouse ={
    x:W/2-25,
    y:H-150};
    var isExplode={
       state:false,no:0,x:[],y:[],size:[]
    }
    
    // begin Audio
    var soundtrack=new Audio();
    soundtrack.src="https://www.dropbox.com/s/aojle7l9jzb2scd/ANW1907_06_Aliens.mp3?dl=1";
    soundtrack.volume=1;
    soundtrack.loop=true;
    var explode=new Audio();
    explode.src="https://www.dropbox.com/s/t7eu5w1cvmgmqg1/Explosion.wav?dl=1";
    explode.volume=0.5;
    function playAudioexplode(exp){
        if(exp){
            try{
               explode.play();                                               
            }catch(err){}
                  
        }
     }
    //end
    
    const loadImages = function(sources, callback){
        let nb = 0;
        let loaded = 0;
        let imgs = {};
        let box=document.getElementById("box");
        let load=document.getElementById("load");
        let status=document.getElementById("status");
        let Start=document.getElementById("start");
        let bnt_start=document.getElementById("bnt_start");
        let cv=document.getElementById("canvas");
        for(let i in sources){
           nb++;
           imgs[i] = new Image();
           imgs[i].src = sources[i];
           imgs[i].onload = function(){
           loaded++;
           load.style.width=(loaded/nb)*100+"%";   
          status.innerHTML="Loading : "+(loaded/nb)*100+" %"
                if(loaded == nb){          
                load.style.display="none";
                status.innerHTML="Ready";
                bnt_start.style.display="block";
                bnt_start.addEventListener("click",function(){
                box.style.display ="none";
                Start.disable=true;
                cv.style.display="block";
                try{
                    callback(imgs);                                  
                    soundtrack.play();
                    if(soundtrack.paused){
                    soundtrack.play();
                    }
                   }catch(err){}    
                 });
                                
                }
            }
        }
    }
    const Main=()=>{
    var e=[],b=[],hk=[]; 
    var HP=1000,score=0,d=500;
    var speed=5000;
    var noBullet=50;
    
    ///Explode
    var row = 0,col =0,lft=0,count=0;
    function Sprite(pic,xPos,yPos,width,height,segX){
    count++;
    let frameW=pic.width/segX;
    let frameH=pic.height; 
    
    c.drawImage(pic,lft*128,col*frameH,frameW,frameH,xPos,yPos,width,height);
           row+=1;
           if(row ==segX){row=0;}
           if(row%1!=0){lft=Math.floor(row);}else{lft=row;}
    }
    function explode(x,y,z){
    row = 0,col =0,lft=0
    isExplode.state=true;
    isExplode.x[isExplode.no]=x;
    isExplode.y[isExplode.no]=y;
    isExplode.size[isExplode.no]=z;
    isExplode.no++; 
    setTimeout(function(){
    isExplode.state=false;
    isExplode.no=0;
    },500);
    }
    //End Explode 
    canvas.addEventListener("mousemove", function(event){
    mouse.x = event.clientX-25;
    //mouse.y = event.clientY;
    });
    canvas.addEventListener("touchmove", function(event){
      var rect = canvas.getBoundingClientRect();
      var root = document.documentElement;
      var touch = event.changedTouches[0];
      var touchX = parseInt(touch.clientX);
      var touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
      event.preventDefault();
      mouse.x = touchX-25;
      //mouse.y = touchY;
    });
    //object
    class Player{
        constructor(x,y,w,h)
    {      
          this.x = x;
    this.y = y;
          this.w = w;
    this.h = h;
        
    }
        draw(){
             this.x=mouse.x;  
             c.drawImage(images.PImg,this.x, this.y,this.w,this.h);
             
        } 
       
    }
    class Bullet extends Player{
      constructor(x,y,w,h,speed)
    {
          super(x,y,w,h);
          this.speed=speed; 
        
    }
      draw(){
           this.y -= this.speed;
           c.drawImage(images.BImg,this.x, this.y,this.w,this.h);
           
       }
    }
    
    class Healthkit extends Player{
        constructor(x,y,w,h,speed){
          super(x,y,w,h);      
          this.speed=speed;
        }
        draw(){
             this.y += this.speed;
        
             c.drawImage(images.HPImg,this.x, this.y,this.w,this.h);
        
        }
    }
    class Enemy extends Player{
      constructor(x,y,w,h,speed)
    {
          super(x,y,w,h);
          this.speed=speed;
        
    }
      draw(){ 
           this.y += this.speed;
           c.drawImage(images.EImg,this.x, this.y,this.w,this.h);
           
      }
    }
    ///end
    var player= new Player(mouse.x,mouse.y,50,130);
    function drawEnemies(){
             setInterval(()=>{ 
             for(let i=0;i<2;i++){                                
              let x =Math.random()*(W-100);
              let sd=Math.random()*3+1;
              e.push(new Enemy(x,-150,80,60,sd));    
             }
             },speed);
    }
    function shood(){
    setInterval(()=>{
        if(noBullet>0){    
        let xpos = mouse.x+21;
        b.push(new Bullet(xpos,mouse.y-5,10,25,10));
        --noBullet;
        }
        },500); 
    }
    function drawHp(){
             setInterval(()=>{
             let x =Math.random()*(W-50);
             let s=Math.random()*7+1;
             hk.push(new Healthkit(x,-50,30,30,s));
           },1e4);
    }
    drawEnemies();
    shood();
    drawHp();
    //end
    //window.onerror=true;
    
    function collision(a,b){
    try{
        return a.x < b.x + b.w &&
             a.x + a.w > b.x &&
             a.y < b.y + b.h &&
             a.y + a.h > b.y;
    }catch(err){}
      
    }
    
    
    c.fillStyle ="#f5f5f5"
    c.font = "18px courier";
    
    function animate(){
      c.beginPath();
      c.clearRect(0,0,W,H); 
      c.fillText(`HP : ${HP}`, 5,25);
      c.fillText(`Bullet : ${noBullet}`,5,45);
      c.fillText(`Score : ${score}`,5,65);
      c.closePath();  
      player.draw();
      for(let $$i in b){
          b[$$i].draw();
          if(b[$$i].y<=0)b.splice($$i,1);
      }
      for(let _i in e){
         e[_i].draw();
         if(e[_i].y>H){
           e.splice(_i,1);
           HP-=d;   
         }    
        
    if(collision(e[_i],player)){
            explode(e[_i].x,e[_i].y,100);   
            
    e.splice(_i,1);
    HP-=500;
        }   
     }
     for(let i in e){
       for(let j in b){
          if(collision(e[i],b[j])){
          explode(e[i].x,e[i].y,100);           
          e.splice(i,1);
          b.splice(j,1);
          speed-=10;
          score++;      
          }
       }
     } 
     for(let $i in hk){
          hk[$i].draw();
          if(hk[$i].y>=H)hk.splice($i,1);
     }
     for(let ii in b){
      for(let jj in hk){
        if(collision(b[ii],hk[jj])){
            b.splice(ii,1);
            hk.splice(jj,1);
            HP+=100;
            noBullet+=25;
            if(speed>=1000)speed-=100;
         }
          
       }
     }
     
    if(isExplode.state){
       for(let $=0;$<isExplode.no;$++){
       Sprite(images.Explosion,isExplode.x[$],isExplode.y[$],isExplode.size[$],isExplode.size[$],16);
       }
    }   
    if(HP<=0){ 
         soundtrack.pause();  
         alert("Game over \n You was score :"+score);
         soundtrack.play();
         e=[],b=[],hk=[];
         noBullet=50;speed=5000;
         HP=1000;score=0;    
       }
     requestAnimationFrame(animate); 
     
    }animate();
      
    
    }//
    const s={
        PImg:"https://www.dropbox.com/s/7nvg50f2quy2z9l/ship9b_0.png?dl=1",
        BImg:"https://www.dropbox.com/s/mnxd7gxxnzlhzyw/56e997cf6d0a0_thumb900~2.jpg?dl=1",
        HPImg:"https://www.dropbox.com/s/0k8jmb74a52tklu/HP.jpg?dl=1",
        EImg:"https://www.dropbox.com/s/xmhuzwxpvp5wtj5/enemy3.png?dl=1",
        Explosion:"https://www.dropbox.com/s/wc98iv2c6vf4bvx/explode.png?dl=1"
        };
    
    let images={};
    loadImages(s,function(imgs){
            images = imgs;
            Main();
        });
    }
    