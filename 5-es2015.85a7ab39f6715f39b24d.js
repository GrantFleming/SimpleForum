(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"S5h/":function(t,n,r){"use strict";r.r(n),r.d(n,"ForumExplorerModule",(function(){return M}));var e=r("ofXK"),o=r("Wp6s"),i=r("tyNb"),c=r("fXoL"),u=r("6oFh");function s(...t){if(t.length<2)return!0;const n=t[0];for(const r of t.slice(1))if(n!==r){if(null===n||null===r)return!1;if(void 0===n||void 0===r)return!1;if(n.id!==r.id||n.name!==r.name||n.description!==r.description)return!1}return!0}var m=r("pLZG"),a=r("QQ3A"),f=r("bTqV");const b=function(t){return["/forums/",t]};let p=(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=c.Gb({type:t,selectors:[["app-forum-info"]],inputs:{forum:"forum"},decls:10,vars:5,consts:[[1,"container"],[1,"name"],[1,"desc"],["color","primary","mat-raised-button","",1,"forum-button",3,"routerLink"]],template:function(t,n){1&t&&(c.Rb(0,"div",0),c.Rb(1,"mat-card"),c.Rb(2,"mat-card-header"),c.Rb(3,"mat-card-title",1),c.tc(4),c.Qb(),c.Qb(),c.Rb(5,"mat-card-content"),c.Rb(6,"p",2),c.tc(7),c.Qb(),c.Qb(),c.Qb(),c.Rb(8,"button",3),c.tc(9,"Visit Forum "),c.Qb(),c.Qb()),2&t&&(c.Bb(4),c.uc(null==n.forum?null:n.forum.name),c.Bb(3),c.uc(null==n.forum?null:n.forum.description),c.Bb(1),c.gc("routerLink",c.ic(3,b,null==n.forum?null:n.forum.id)))},directives:[o.a,o.c,o.f,o.b,f.a,i.c],styles:[".container[_ngcontent-%COMP%]{margin:0 -.5rem;display:flex;flex-wrap:wrap;justify-content:flex-end}.container[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%]{flex-basis:400px;flex-grow:1;margin:0 .5rem}.container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-size:1.2rem;width:7rem;margin:0 .5rem;white-space:normal}@media (max-width:599.9px){.container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{transform:translate(-35px,-10px);width:8em}}.container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{cursor:pointer}"]}),t})();function l(t,n){1&t&&c.Nb(0,"app-forum-info",1),2&t&&c.gc("forum",n.$implicit)}let d=(()=>{class t{constructor(t){this.forumService=t}ngOnInit(){this._getForums()}ngOnDestroy(){clearTimeout(this.nextUpdate)}_getForums(){this.forumService.getForums().pipe(Object(m.a)(t=>!function(t,n){if(t===n)return!0;if(null===t||null===n)return!1;if(void 0===t||void 0===n)return!1;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(!s(t[r],n[r]))return!1;return!0}(t,this.forums))).subscribe({next:t=>this.forums=t,complete:()=>this.nextUpdate=setTimeout(()=>this._getForums(),5e3)})}addForum(t){t&&this.forums.push(t)}}return t.\u0275fac=function(n){return new(n||t)(c.Mb(a.a))},t.\u0275cmp=c.Gb({type:t,selectors:[["app-forum-list"]],decls:1,vars:1,consts:[[3,"forum",4,"ngFor","ngForOf"],[3,"forum"]],template:function(t,n){1&t&&c.rc(0,l,1,1,"app-forum-info",0),2&t&&c.gc("ngForOf",n.forums)},directives:[e.h,p],styles:["app-forum-info[_ngcontent-%COMP%]{padding:1em}"]}),t})();var g=r("3Pt+"),h=r("kmnG"),F=r("qFsG");let w=(()=>{class t{constructor(t,n){this.fb=t,this.forumService=n,this.newForumEvent=new c.n,this.newForumForm=this.fb.group({name:["",[g.j.required,g.j.maxLength(128)]],description:["",[g.j.required]]})}get name(){return this.newForumForm.get("name")}get nameErrors(){return this.name.errors?Object.keys(this.name.errors):[]}get description(){return this.newForumForm.get("description")}get descriptionErrors(){return this.description.errors?Object.keys(this.description.errors):[]}ngOnInit(){}onSubmit(t){const n=Object.assign({id:null},t);this.forumService.addForum(n).subscribe(t=>this.newForumEvent.emit(t))}}return t.\u0275fac=function(n){return new(n||t)(c.Mb(g.b),c.Mb(a.a))},t.\u0275cmp=c.Gb({type:t,selectors:[["app-add-forum"]],viewQuery:function(t,n){var r;1&t&&c.xc(g.d,!0),2&t&&c.jc(r=c.ac())&&(n.form=r.first)},outputs:{newForumEvent:"newForumEvent"},decls:16,vars:4,consts:[[3,"formGroup","ngSubmit"],["ngForm","ngForm"],["formControlName","name","id","name","matInput","","type","text"],["formControlName","description","id","description","matInput","","type","text"],["color","primary","mat-raised-button","","type","submit",1,"button",3,"disabled"]],template:function(t,n){if(1&t){const t=c.Sb();c.Rb(0,"form",0,1),c.Zb("ngSubmit",(function(){c.lc(t);const r=c.kc(1);return n.onSubmit(n.newForumForm.value),r.resetForm()})),c.Rb(2,"mat-form-field"),c.Rb(3,"mat-label"),c.tc(4,"Forum name"),c.Qb(),c.Nb(5,"input",2),c.Rb(6,"mat-error"),c.tc(7),c.Qb(),c.Qb(),c.Rb(8,"mat-form-field"),c.Rb(9,"mat-label"),c.tc(10,"Forum Description"),c.Qb(),c.Nb(11,"textarea",3),c.Rb(12,"mat-error"),c.tc(13),c.Qb(),c.Qb(),c.Rb(14,"button",4),c.tc(15,"Create Forum "),c.Qb(),c.Qb()}2&t&&(c.gc("formGroup",n.newForumForm),c.Bb(7),c.uc(n.nameErrors),c.Bb(6),c.uc(n.descriptionErrors),c.Bb(1),c.gc("disabled",n.newForumForm.invalid))},directives:[g.k,g.g,g.d,h.b,h.e,g.a,F.a,g.f,g.c,h.a,f.a],styles:["mat-form-field[_ngcontent-%COMP%]{width:100%}textarea[_ngcontent-%COMP%]{min-height:100px;max-height:300px;height:100%}"]}),t})();function v(t,n){if(1&t){const t=c.Sb();c.Rb(0,"app-add-forum",5),c.Zb("newForumEvent",(function(n){return c.lc(t),c.dc(),c.kc(5).addForum(n)})),c.Qb()}}const x=function(){return{return_to_previous:!0}};function y(t,n){1&t&&(c.Rb(0,"button",6),c.tc(1,"Log in to create your own forums! "),c.Qb()),2&t&&c.gc("queryParams",c.hc(1,x))}const O=[{path:"",component:(()=>{class t{constructor(t,n){this.authService=t,this.route=n}ngOnInit(){}}return t.\u0275fac=function(n){return new(n||t)(c.Mb(u.b),c.Mb(i.a))},t.\u0275cmp=c.Gb({type:t,selectors:[["app-forum-explorer"]],decls:10,vars:2,consts:[[1,"container"],["forumListComponent",""],[1,"spacer"],[3,"newForumEvent",4,"ngIf","ngIfElse"],["log_in_prompt",""],[3,"newForumEvent"],["color","primary","mat-raised-button","","routerLink","/user/login",3,"queryParams"]],template:function(t,n){if(1&t&&(c.Rb(0,"div",0),c.Rb(1,"h2"),c.tc(2,"Forum Explorer"),c.Qb(),c.Nb(3,"hr"),c.Nb(4,"app-forum-list",null,1),c.Nb(6,"div",2),c.rc(7,v,1,0,"app-add-forum",3),c.rc(8,y,2,2,"ng-template",null,4,c.sc),c.Qb()),2&t){const t=c.kc(9);c.Bb(7),c.gc("ngIf",n.authService.isLoggedIn())("ngIfElse",t)}},directives:[d,e.i,w,f.a,i.c],styles:[".container[_ngcontent-%COMP%]{display:block;margin:auto;padding:2em;text-align:center;max-width:1024px}app-forum-list[_ngcontent-%COMP%]{text-align:left}.spacer[_ngcontent-%COMP%]{margin-bottom:1em}app-add-forum[_ngcontent-%COMP%]{max-width:700px;width:100%;display:inline-block}"]}),t})()}];let _=(()=>{class t{}return t.\u0275mod=c.Kb({type:t}),t.\u0275inj=c.Jb({factory:function(n){return new(n||t)},imports:[[i.e.forChild(O)],i.e]}),t})(),M=(()=>{class t{}return t.\u0275mod=c.Kb({type:t}),t.\u0275inj=c.Jb({factory:function(n){return new(n||t)},imports:[[e.b,g.i,F.b,f.b,o.d,_]]}),t})()}}]);