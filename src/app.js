var puntos1 = 0;
var puntos2 = 0;

var HelloWorldLayer = cc.Layer.extend({
    jugador1:null,    
    jugador2:null,    
    pelota:null,  
    puntuacion1:null,
    puntuacion2:null,
    etiquetas: [],
    
    moverJugador: function(location, event){
		  cc.log("Mover nave");
		  var  juego = event.getCurrentTarget();
          var ubicacion = location.getLocation();
          var posy = ubicacion.y;
      
          if (posy > 540){posy = 540}
          if(posy < 0){posy = 0}
        
          if(ubicacion.x < 480){
              
             juego.jugador1.setPosition(juego.jugador1.x,posy);

          }
          else{
          
             juego.jugador2.setPosition(juego.jugador2.x,posy);
          }
		  

	   },
    
    mover: function(location, event){
            return true;
	   },
    
    update: function(dt){
        
        //Determina de que lado esta la pelota
        var lado = 0;
        if (this.pelota.x <= 480){
            lado = 1;
            
        }
        else{
            lado=2;
        }
        
        //Rebote arriba y abajo
        if (this.pelota.y <= 0 || this.pelota.y >= 640){
            this.yvel = this.yvel * -1; 
            
        }
        
        //Verifica Contacto con jugador 2
        if (lado ==2){
            if(Math.floor(this.pelota.x) >= Math.floor(this.jugador2.x)
              && ( Math.floor(this.pelota.y) >= Math.floor(this.jugador2.y))
              && ( Math.floor(this.pelota.y) <= Math.floor(this.jugador2.y +100))){
                
                this.xvel = this.xvel * -1;    
            }    
        }
        //Verifica contacto con jugador 1
        else{
            if(Math.floor(this.pelota.x) <= Math.floor(this.jugador1.x+30)
              && ( Math.floor(this.pelota.y) >= Math.floor(this.jugador1.y))
              && ( Math.floor(this.pelota.y) <= Math.floor(this.jugador1.y +100))){
                
                
                    this.xvel = this.xvel * -1;    
            }
            
        }
        
        
        this.pelota.y = this.pelota.y + this.yvel;
        this.pelota.x = this.pelota.x + this.xvel;
        
        if (this.pelota.x <= 0 || this.pelota.x >= 960){
            var lado = 0;
            if (this.pelota.x <=0){
                lado =1;
            }else{
                lado =2;
            }
            this.Reiniciopelota(0,lado);
    
        }
        
        
    },
    
    random: function getRandomInt(min, max) {
        return Math.random() * (max - min + 1) + min;
	},
    
    Reiniciopelota: function(primero, lado){
        
        
        var localetiq = this.etiquetas;
        
        var EvaluaPuntos = function(){
        
            if (primero ==1){
                if (lado == 1 ){
                    this.puntos1 = 0;    
                }else{
                    this.puntos2 = 0;    
                        
                }
                
            }
            else {
                if (lado == 1 ){
                    this.puntos2 = this.puntos2 + 1;
                }else {
                    this.puntos1 = this.puntos1 + 1;
                }
            }
            
            if (lado == 2){
                localetiq[0].setString(" " + this.puntos1);
            }else {
                localetiq[1].setString(" " + this.puntos2);
            }
        }    
        
        this.pelota.setPosition(this.tam.width / 2,this.tam.height / 2);
        var tempdir = this.random(-4,4)
        if (tempdir < 0){
            this.xvel = -4;     
        }else {
            this.xvel = 4; 
        }
        
        this.yvel = this.random(-3,3);
        EvaluaPuntos();
    },
    
    
    inicializar:function(){
        var size = cc.winSize;
        var color = cc.color(100,100,100);

        this.jugador1 =  new cc.DrawNode();
        this.jugador1.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador1.setPosition(size.width * 0.01,size.height / 2);
        this.addChild(this.jugador1, 1);
        
        this.jugador2 =  new cc.DrawNode();
        this.jugador2.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador2.setPosition(size.width -(size.width * 0.03),size.height / 2);
        this.addChild(this.jugador2, 1);        

        var lineaDivisoria =  new cc.DrawNode();
        lineaDivisoria.drawSegment(cc.p(size.width/2,0),cc.p(size.width/2,size.height),3,color);
        this.addChild(lineaDivisoria,0);
        
        this.pelota =  new cc.DrawNode();
        this.pelota.drawCircle(cc.p(0,0),5,0,100,false,10,color);
        this.pelota.setPosition(size.width / 2,size.height / 2);
        this.tam = size;
        this.addChild(this.pelota, 1);
        
        this.puntuacion1 = new cc.LabelTTF(" " + puntos1,"Arial",24);
        this.puntuacion1.setPosition(size.width * 0.4, size.height - (size.height * 0.10));
        this.addChild(this.puntuacion1,0);
        this.etiquetas.push(this.puntuacion1);
        
        this.puntuacion2 = new cc.LabelTTF(" " + puntos2 ,"Arial",24);
        this.puntuacion2.setPosition(size.width - (size.width * 0.4), size.height - (size.height * 0.10));
        this.addChild(this.puntuacion2,0);  
        this.etiquetas.push(this.puntuacion2);
    
    },
    
    ctor:function () {
        this._super();
        this.inicializar();
        this.scheduleUpdate();
        this.Reiniciopelota(1,1);
        
       // Inicializando eventos
		cc.eventManager.addListener({
		  event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.mover,
			onTouchMoved: this.moverJugador
            
			
		}, this);

		
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

