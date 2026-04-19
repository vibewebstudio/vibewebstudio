"use client";

import { useEffect, useRef } from "react";

export default function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = 0, H = 0, raf;
    let stars = [], nebulae = [], shooters = [];

    function rand(a, b) { return a + Math.random() * (b - a); }
    function randInt(a, b) { return Math.floor(rand(a, b)); }

    function resize() {
      // Read the section's actual rendered size via getBoundingClientRect
      const rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width   || window.innerWidth;
      H = rect.height  || window.innerHeight;
      // Set the actual pixel buffer size
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
      canvas.width  = W;
      canvas.height = H;
    }

    const STAR_COLORS = [
      [220,230,255],[200,215,255],[255,255,255],[180,200,255],[255,240,210],
    ];

    function buildStars() {
      stars = [];
      [[400,0.3,0.7,0.2,0.5],[150,0.7,1.2,0.4,0.8],[50,1.2,2.2,0.7,1.0]]
        .forEach(([count,minR,maxR,minA,maxA]) => {
          for (let i=0;i<count;i++) {
            stars.push({
              x:rand(0,W), y:rand(0,H),
              r:rand(minR,maxR), baseA:rand(minA,maxA),
              twinkleSpeed:rand(0.004,0.018),
              twinklePhase:rand(0,Math.PI*2),
              col:STAR_COLORS[randInt(0,5)],
            });
          }
        });
    }

    function buildNebulae() {
      nebulae = [
        {x:W*0.72,y:H*0.18,rx:W*0.38,ry:H*0.35,color:[120,80,200], a:0.13},
        {x:W*0.78,y:H*0.08,rx:W*0.25,ry:H*0.22,color:[60,90,210],  a:0.10},
        {x:W*0.55,y:H*0.42,rx:W*0.30,ry:H*0.18,color:[30,130,220], a:0.09},
        {x:W*0.15,y:H*0.75,rx:W*0.28,ry:H*0.30,color:[100,50,180], a:0.11},
        {x:W*0.48,y:H*0.55,rx:W*0.18,ry:H*0.14,color:[200,140,60], a:0.06},
        {x:W*0.88,y:H*0.60,rx:W*0.20,ry:H*0.25,color:[50,100,230], a:0.08},
      ];
    }

    const SHOOT_COLORS = ["187,158,255","0,207,252","170,255,220","255,255,255"];

    class ShootingStar {
      constructor() { this.reset(true); }
      reset(initial=false) {
        const edge=randInt(0,4);
        if (edge===0)      {this.x=rand(-50,W+50);this.y=rand(-60,-10);  this.angle=rand(20,160)*(Math.PI/180);}
        else if (edge===1) {this.x=rand(-50,W+50);this.y=H+rand(10,60);  this.angle=rand(200,340)*(Math.PI/180);}
        else if (edge===2) {this.x=rand(-60,-10); this.y=rand(-50,H+50); this.angle=rand(-70,70)*(Math.PI/180);}
        else               {this.x=W+rand(10,60); this.y=rand(-50,H+50); this.angle=rand(110,250)*(Math.PI/180);}
        if (initial){this.x=rand(0,W);this.y=rand(0,H);}
        this.speed=rand(8,18);
        this.vx=Math.cos(this.angle)*this.speed;
        this.vy=Math.sin(this.angle)*this.speed;
        this.len=rand(100,300); this.width=rand(1.0,2.5);
        this.col=SHOOT_COLORS[randInt(0,4)];
        this.alpha=rand(0.6,1.0); this.life=1.0;
        this.decay=rand(0.009,0.020); this.trail=[];
      }
      update() {
        this.x+=this.vx; this.y+=this.vy; this.life-=this.decay;
        this.trail.push({x:this.x,y:this.y,life:this.life});
        if (this.trail.length>20) this.trail.shift();
        if (this.life<=0||this.x<-300||this.x>W+300||this.y<-300||this.y>H+300) this.reset();
      }
      draw() {
        if (this.life<=0) return;
        const tx=this.x-Math.cos(this.angle)*this.len;
        const ty=this.y-Math.sin(this.angle)*this.len;
        const g=ctx.createLinearGradient(tx,ty,this.x,this.y);
        g.addColorStop(0,`rgba(${this.col},0)`);
        g.addColorStop(0.5,`rgba(${this.col},${(this.alpha*this.life*0.3).toFixed(3)})`);
        g.addColorStop(1,`rgba(${this.col},${(this.alpha*this.life).toFixed(3)})`);
        ctx.save();ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(this.x,this.y);
        ctx.strokeStyle=g;ctx.lineWidth=this.width;ctx.lineCap="round";
        ctx.shadowColor=`rgba(${this.col},0.8)`;ctx.shadowBlur=12;ctx.stroke();ctx.restore();
        ctx.save();ctx.beginPath();ctx.arc(this.x,this.y,this.width*1.8,0,Math.PI*2);
        ctx.fillStyle=`rgba(${this.col},${(this.alpha*this.life).toFixed(3)})`;
        ctx.shadowColor=`rgba(${this.col},0.9)`;ctx.shadowBlur=18;ctx.fill();ctx.restore();
        this.trail.forEach((p,i)=>{
          const t=i/this.trail.length;
          ctx.save();ctx.beginPath();
          ctx.arc(p.x+rand(-3,3),p.y+rand(-3,3),rand(0.3,1.4),0,Math.PI*2);
          ctx.fillStyle=`rgba(${this.col},${(t*p.life*0.4).toFixed(3)})`;
          ctx.fill();ctx.restore();
        });
      }
    }

    function init() {
      resize();
      buildStars();
      buildNebulae();
      shooters = Array.from({length:12},()=>new ShootingStar());
      shooters.forEach(s=>{s.life=rand(0.1,1.0);});
    }

    let burstTimer=0;
    function tick() {
      ctx.fillStyle="#07070f";
      ctx.fillRect(0,0,W,H);

      nebulae.forEach(({x,y,rx,ry,color:[r,g,b],a})=>{
        const grad=ctx.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));
        grad.addColorStop(0,`rgba(${r},${g},${b},${a})`);
        grad.addColorStop(0.5,`rgba(${r},${g},${b},${(a*0.4).toFixed(3)})`);
        grad.addColorStop(1,`rgba(${r},${g},${b},0)`);
        ctx.save();ctx.beginPath();
        ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
        ctx.fillStyle=grad;ctx.fill();ctx.restore();
      });

      stars.forEach(s=>{
        s.twinklePhase+=s.twinkleSpeed;
        const a=Math.min(1,s.baseA*(0.7+0.3*Math.sin(s.twinklePhase)));
        const [r,g,b]=s.col;
        if (s.r>1.2){
          const grd=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*5);
          grd.addColorStop(0,`rgba(${r},${g},${b},${(a*0.3).toFixed(3)})`);
          grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
          ctx.beginPath();ctx.arc(s.x,s.y,s.r*5,0,Math.PI*2);
          ctx.fillStyle=grd;ctx.fill();
        }
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${r},${g},${b},${a.toFixed(3)})`;ctx.fill();
      });

      burstTimer++;
      if (burstTimer>=140){
        burstTimer=0;
        const n=randInt(2,5);
        for(let i=0;i<n;i++) shooters[randInt(0,12)].reset();
      }
      shooters.forEach(s=>{s.update();s.draw();});
      raf=requestAnimationFrame(tick);
    }

    // Use ResizeObserver on the PARENT SECTION for accurate height
    const ro = new ResizeObserver(() => {
      resize();
      buildStars();
      buildNebulae();
    });
    ro.observe(canvas.parentElement);

    init();
    tick();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        top:           0,
        left:          0,
        pointerEvents: "none",
        zIndex:        0,
        display:       "block",
      }}
    />
  );
}