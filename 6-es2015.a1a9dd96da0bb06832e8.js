(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{5920:function(t,e,n){"use strict";n.r(e),n.d(e,"ForumModule",(function(){return B}));var o=n("ofXK"),r=n("3Pt+"),s=n("Wp6s"),i=n("fXoL"),c=n("FKr1");n("8LU1"),n("cH1L");let a=(()=>{class t{}return t.\u0275mod=i.Kb({type:t}),t.\u0275inj=i.Jb({factory:function(e){return new(e||t)},imports:[[c.e,c.c],c.e,c.c]}),t})();var u=n("qFsG"),b=n("bTqV"),d=n("bOdf"),p=n("tyNb"),l=n("QQ3A"),m=n("6oFh"),f=n("hCCi");class g{constructor(){this.title="",this.body=""}}let h=(()=>{class t{constructor(){this.post=new g}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=i.Gb({type:t,selectors:[["app-post"]],inputs:{post:"post"},decls:7,vars:2,consts:[[1,"title"],[1,"body"]],template:function(t,e){1&t&&(i.Rb(0,"mat-card"),i.Rb(1,"mat-card-header"),i.Rb(2,"mat-card-title",0),i.tc(3),i.Qb(),i.Qb(),i.Rb(4,"mat-card-content"),i.Rb(5,"p",1),i.tc(6),i.Qb(),i.Qb(),i.Qb()),2&t&&(i.Bb(3),i.uc(e.post.title),i.Bb(3),i.uc(e.post.body))},directives:[s.a,s.c,s.f,s.b],styles:["mat-card-content[_ngcontent-%COMP%]{text-align:left}"]}),t})();const y=["forumId",""];function P(t,e){if(1&t&&i.Nb(0,"app-post",4),2&t){const t=e.$implicit;i.Db("last",e.last),i.gc("post",t)}}function w(t,e){if(1&t&&(i.Pb(0),i.rc(1,P,1,3,"app-post",3),i.Ob()),2&t){const t=i.dc();i.Bb(1),i.gc("ngForOf",t.posts)}}function I(t,e){1&t&&(i.Rb(0,"div",5),i.Rb(1,"p"),i.tc(2,"There are no posts in this forum yet."),i.Qb(),i.Rb(3,"p"),i.tc(4,"You should add one!"),i.Qb(),i.Qb())}let v=(()=>{class t{constructor(t){this.postService=t,this.newPost=!1}ngOnInit(){}ngOnChanges(t){this._checkAttributes(),clearTimeout(this.nextUpdate),this._getPosts()}addPost(t){this.posts.push(t),this.newPost=!0}_checkAttributes(){if(null==this.forumId)throw new Error("Attribute 'forumId' cannot be undefined or null.")}ngOnDestroy(){clearTimeout(this.nextUpdate)}ngAfterViewChecked(){if(this.newPost){const t=document.querySelector("app-post.last");scrollBy(0,t.scrollHeight+t.children.item(0).clientHeight),this.newPost=!1}}_getPosts(){this.postService.getPosts(this.forumId).subscribe({next:t=>{this.posts=t},complete:()=>{this.nextUpdate=setTimeout(()=>this._getPosts(),5e3)}})}}return t.\u0275fac=function(e){return new(e||t)(i.Mb(f.a))},t.\u0275cmp=i.Gb({type:t,selectors:[["app-post-feed","forumId",""]],inputs:{forumId:"forumId"},features:[i.zb],attrs:y,decls:4,vars:2,consts:[[1,"container"],[4,"ngIf","ngIfElse"],["noPostsNotification",""],[3,"last","post",4,"ngFor","ngForOf"],[3,"post"],[1,"noPostNotification"]],template:function(t,e){if(1&t&&(i.Rb(0,"div",0),i.rc(1,w,2,1,"ng-container",1),i.rc(2,I,5,0,"ng-template",null,2,i.sc),i.Qb()),2&t){const t=i.kc(3);i.Bb(1),i.gc("ngIf",!e.posts||e.posts.length>0)("ngIfElse",t)}},directives:[o.i,o.h,h],styles:["app-post[_ngcontent-%COMP%]{padding:1em}.container[_ngcontent-%COMP%]{text-align:center}.noPostNotification[_ngcontent-%COMP%]{display:inline-block;margin:2em;padding:2em;text-align:center;background:#222;border-radius:5px}.noPostNotification[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:1rem}"]}),t})();var O=n("kmnG");const Q=["forumId",""];let R=(()=>{class t{constructor(t,e){this.fb=t,this.postService=e,this.newPostEvent=new i.n,this.newPostForm=this.fb.group({title:["",[r.j.required,r.j.maxLength(128)]],body:["",[r.j.required]]})}get title(){return this.newPostForm.get("title")}get titleErrors(){return this.title.errors?Object.keys(this.title.errors):[]}get body(){return this.newPostForm.get("body")}get bodyErrors(){return this.body.errors?Object.keys(this.body.errors):[]}ngOnInit(){}onSubmit(t){const e=Object.assign({forumId:this.forumId},t);this.postService.addPost(e).subscribe(t=>this.newPostEvent.emit(t))}}return t.\u0275fac=function(e){return new(e||t)(i.Mb(r.b),i.Mb(f.a))},t.\u0275cmp=i.Gb({type:t,selectors:[["app-add-post","forumId",""]],inputs:{forumId:"forumId"},outputs:{newPostEvent:"newPostEvent"},attrs:Q,decls:16,vars:4,consts:[[3,"formGroup","ngSubmit"],["ngForm","ngForm"],["formControlName","title","id","title","matInput","","type","text"],["formControlName","body","id","body","matInput","","type","text"],["color","primary","mat-raised-button","","type","submit",1,"button",3,"disabled"]],template:function(t,e){if(1&t){const t=i.Sb();i.Rb(0,"form",0,1),i.Zb("ngSubmit",(function(){i.lc(t);const n=i.kc(1);return e.onSubmit(e.newPostForm.value),n.resetForm()})),i.Rb(2,"mat-form-field"),i.Rb(3,"mat-label"),i.tc(4,"Title"),i.Qb(),i.Nb(5,"input",2),i.Rb(6,"mat-error"),i.tc(7),i.Qb(),i.Qb(),i.Rb(8,"mat-form-field"),i.Rb(9,"mat-label"),i.tc(10,"Body"),i.Qb(),i.Nb(11,"textarea",3),i.Rb(12,"mat-error"),i.tc(13),i.Qb(),i.Qb(),i.Rb(14,"button",4),i.tc(15,"Post"),i.Qb(),i.Qb()}2&t&&(i.gc("formGroup",e.newPostForm),i.Bb(7),i.uc(e.titleErrors),i.Bb(6),i.uc(e.bodyErrors),i.Bb(1),i.gc("disabled",e.newPostForm.invalid))},directives:[r.k,r.g,r.d,O.b,O.e,r.a,u.a,r.f,r.c,O.a,b.a],styles:["mat-form-field[_ngcontent-%COMP%]{width:100%}textarea[_ngcontent-%COMP%]{min-height:100px;max-height:300px;height:100%}"]}),t})();function x(t,e){if(1&t){const t=i.Sb();i.Rb(0,"app-add-post",11),i.Zb("newPostEvent",(function(e){return i.lc(t),i.dc(),i.kc(6).addPost(e)})),i.Qb()}if(2&t){const t=i.dc(2);i.gc("forumId",t.forum.id)}}const M=function(){return{return_to_previous:!0}};function _(t,e){1&t&&(i.Rb(0,"button",12),i.tc(1,"Log in to add your own posts! "),i.Qb()),2&t&&i.gc("queryParams",i.hc(1,M))}function C(t,e){if(1&t&&(i.Rb(0,"div",4),i.Rb(1,"h2",5),i.tc(2),i.Qb(),i.Rb(3,"p",6),i.tc(4),i.Qb(),i.Nb(5,"app-post-feed",7,8),i.rc(7,x,1,1,"app-add-post",9),i.rc(8,_,2,2,"ng-template",null,10,i.sc),i.Qb()),2&t){const t=i.kc(9),e=i.dc();i.Bb(2),i.uc(e.forum.name),i.Bb(2),i.uc(e.forum.description),i.Bb(1),i.gc("forumId",e.forum.id),i.Bb(2),i.gc("ngIf",e.authService.isLoggedIn())("ngIfElse",t)}}function k(t,e){1&t&&(i.Rb(0,"div",13),i.tc(1," We are loading your content "),i.Qb())}const E=[{path:"",component:(()=>{class t{constructor(t,e,n,o){this.route=t,this.forumService=e,this.router=n,this.authService=o}ngOnInit(){this.route.paramMap.pipe(Object(d.a)(t=>this.forumService.getForum(+t.get("id")))).subscribe(t=>this.forum=t,()=>this.router.navigateByUrl("/page-not-found",{replaceUrl:!0}))}}return t.\u0275fac=function(e){return new(e||t)(i.Mb(p.a),i.Mb(l.a),i.Mb(p.b),i.Mb(m.b))},t.\u0275cmp=i.Gb({type:t,selectors:[["app-forum"]],decls:6,vars:2,consts:[[1,"control-bar"],["color","primary","mat-raised-button","","routerLink","/forums",1,"forum-explorer-button"],["class","container",4,"ngIf","ngIfElse"],["loading",""],[1,"container"],[1,"forum-name"],[1,"forum-desc"],[3,"forumId"],["feedComponent",""],[3,"forumId","newPostEvent",4,"ngIf","ngIfElse"],["login_prompt",""],[3,"forumId","newPostEvent"],["color","primary","mat-raised-button","","routerLink","/user/login",1,"login_prompt",3,"queryParams"],[1,"container","loading-widget"]],template:function(t,e){if(1&t&&(i.Rb(0,"div",0),i.Rb(1,"button",1),i.tc(2,"Forum Explorer "),i.Qb(),i.Qb(),i.rc(3,C,10,5,"div",2),i.rc(4,k,2,0,"ng-template",null,3,i.sc)),2&t){const t=i.kc(5);i.Bb(3),i.gc("ngIf",e.forum)("ngIfElse",t)}},directives:[b.a,p.c,o.i,v,R],styles:["*[_ngcontent-%COMP%]{max-width:1024px;display:block;margin:auto}.control-bar[_ngcontent-%COMP%]{padding:0 2em;height:2em}.control-bar[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin:0 0 0 1em;float:right}.container[_ngcontent-%COMP%]{padding:2em;text-align:center}app-post-feed[_ngcontent-%COMP%]{text-align:left}app-add-post[_ngcontent-%COMP%]{max-width:700px;width:100%;display:inline-block}"]}),t})()}];let F=(()=>{class t{}return t.\u0275mod=i.Kb({type:t}),t.\u0275inj=i.Jb({factory:function(e){return new(e||t)},imports:[[p.e.forChild(E)],p.e]}),t})(),B=(()=>{class t{}return t.\u0275mod=i.Kb({type:t}),t.\u0275inj=i.Jb({factory:function(e){return new(e||t)},imports:[[o.b,r.i,s.d,a,u.b,b.b,F]]}),t})()}}]);