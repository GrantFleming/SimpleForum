(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"S5h/":function(t,n,r){"use strict";r.r(n);var e=r("ofXK"),o=r("Wp6s"),i=r("tyNb"),c=r("fXoL");function u(...t){if(t.length<2)return!0;const n=t[0];for(const r of t.slice(1))if(n!==r){if(null===n||null===r)return!1;if(void 0===n||void 0===r)return!1;if(n.id!==r.id||n.name!==r.name||n.description!==r.description)return!1}return!0}var m=r("pLZG"),s=r("QQ3A"),a=r("bTqV");const f=function(t){return["/forums/",t]};let b=(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=c.Ib({type:t,selectors:[["app-forum-info"]],inputs:{forum:"forum"},decls:10,vars:5,consts:[[1,"container"],[1,"name"],[1,"desc"],["color","primary","mat-raised-button","",1,"forum-button",3,"routerLink"]],template:function(t,n){1&t&&(c.Tb(0,"div",0),c.Tb(1,"mat-card"),c.Tb(2,"mat-card-header"),c.Tb(3,"mat-card-title",1),c.vc(4),c.Sb(),c.Sb(),c.Tb(5,"mat-card-content"),c.Tb(6,"p",2),c.vc(7),c.Sb(),c.Sb(),c.Sb(),c.Tb(8,"button",3),c.vc(9,"Visit Forum "),c.Sb(),c.Sb()),2&t&&(c.Eb(4),c.wc(null==n.forum?null:n.forum.name),c.Eb(3),c.wc(null==n.forum?null:n.forum.description),c.Eb(1),c.ic("routerLink",c.kc(3,f,null==n.forum?null:n.forum.id)))},directives:[o.a,o.c,o.e,o.b,a.a,i.c],styles:[".container[_ngcontent-%COMP%]{margin:0 -.5rem;display:flex;flex-wrap:wrap;justify-content:flex-end}.container[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%]{flex-basis:400px;flex-grow:1;margin:0 .5rem}.container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-size:1.2rem;width:7rem;margin:0 .5rem;white-space:normal}@media (max-width:599.9px){.container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{transform:translate(-35px,-10px);width:8em}}.container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{cursor:pointer}"]}),t})();function p(t,n){1&t&&c.Pb(0,"app-forum-info",1),2&t&&c.ic("forum",n.$implicit)}let l=(()=>{class t{constructor(t){this.forumService=t}ngOnInit(){this._getForums()}ngOnDestroy(){clearTimeout(this.nextUpdate)}_getForums(){this.forumService.getForums().pipe(Object(m.a)(t=>!function(t,n){if(t===n)return!0;if(null===t||null===n)return!1;if(void 0===t||void 0===n)return!1;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(!u(t[r],n[r]))return!1;return!0}(t,this.forums))).subscribe({next:t=>this.forums=t,complete:()=>this.nextUpdate=setTimeout(()=>this._getForums(),5e3)})}addForum(t){t&&this.forums.push(t)}}return t.\u0275fac=function(n){return new(n||t)(c.Ob(s.a))},t.\u0275cmp=c.Ib({type:t,selectors:[["app-forum-list"]],decls:1,vars:1,consts:[[3,"forum",4,"ngFor","ngForOf"],[3,"forum"]],template:function(t,n){1&t&&c.tc(0,p,1,1,"app-forum-info",0),2&t&&c.ic("ngForOf",n.forums)},directives:[e.h,b],styles:["app-forum-info[_ngcontent-%COMP%]{padding:1em}"]}),t})();var d=r("3Pt+"),g=r("kmnG"),h=r("qFsG");let v=(()=>{class t{constructor(t,n){this.fb=t,this.forumService=n,this.newForumEvent=new c.n,this.newForumForm=this.fb.group({name:["",[d.j.required,d.j.maxLength(128)]],description:["",[d.j.required]]})}get name(){return this.newForumForm.get("name")}get nameErrors(){return this.name.errors?Object.keys(this.name.errors):[]}get description(){return this.newForumForm.get("description")}get descriptionErrors(){return this.description.errors?Object.keys(this.description.errors):[]}ngOnInit(){}onSubmit(t){const n=Object.assign({id:null},t);this.forumService.addForum(n).subscribe(t=>this.newForumEvent.emit(t))}}return t.\u0275fac=function(n){return new(n||t)(c.Ob(d.b),c.Ob(s.a))},t.\u0275cmp=c.Ib({type:t,selectors:[["app-add-forum"]],viewQuery:function(t,n){var r;1&t&&c.yc(d.d,!0),2&t&&c.lc(r=c.cc())&&(n.form=r.first)},outputs:{newForumEvent:"newForumEvent"},decls:16,vars:4,consts:[[3,"formGroup","ngSubmit"],["ngForm","ngForm"],["formControlName","name","id","name","matInput","","type","text"],["formControlName","description","id","description","matInput","","type","text"],["color","primary","mat-raised-button","","type","submit",1,"button",3,"disabled"]],template:function(t,n){if(1&t){const t=c.Ub();c.Tb(0,"form",0,1),c.bc("ngSubmit",(function(){c.nc(t);const r=c.mc(1);return n.onSubmit(n.newForumForm.value),r.resetForm()})),c.Tb(2,"mat-form-field"),c.Tb(3,"mat-label"),c.vc(4,"Forum name"),c.Sb(),c.Pb(5,"input",2),c.Tb(6,"mat-error"),c.vc(7),c.Sb(),c.Sb(),c.Tb(8,"mat-form-field"),c.Tb(9,"mat-label"),c.vc(10,"Forum Description"),c.Sb(),c.Pb(11,"textarea",3),c.Tb(12,"mat-error"),c.vc(13),c.Sb(),c.Sb(),c.Tb(14,"button",4),c.vc(15,"Create Forum "),c.Sb(),c.Sb()}2&t&&(c.ic("formGroup",n.newForumForm),c.Eb(7),c.wc(n.nameErrors),c.Eb(6),c.wc(n.descriptionErrors),c.Eb(1),c.ic("disabled",n.newForumForm.invalid))},directives:[d.k,d.g,d.d,g.b,g.e,d.a,h.a,d.f,d.c,g.a,a.a],styles:["mat-form-field[_ngcontent-%COMP%]{width:100%}textarea[_ngcontent-%COMP%]{min-height:100px;max-height:300px;height:100%}"]}),t})();const w=[{path:"",component:(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=c.Ib({type:t,selectors:[["app-forum-explorer"]],decls:8,vars:0,consts:[[1,"container"],["forumListComponent",""],[1,"spacer"],[3,"newForumEvent"]],template:function(t,n){if(1&t){const t=c.Ub();c.Tb(0,"div",0),c.Tb(1,"h2"),c.vc(2,"Forum Explorer"),c.Sb(),c.Pb(3,"hr"),c.Pb(4,"app-forum-list",null,1),c.Pb(6,"div",2),c.Tb(7,"app-add-forum",3),c.bc("newForumEvent",(function(n){return c.nc(t),c.mc(5).addForum(n)})),c.Sb(),c.Sb()}},directives:[l,v],styles:[".container[_ngcontent-%COMP%]{display:block;margin:auto;padding:2em;text-align:center;max-width:1024px}app-forum-list[_ngcontent-%COMP%]{text-align:left}.spacer[_ngcontent-%COMP%]{margin-bottom:1em}app-add-forum[_ngcontent-%COMP%]{max-width:700px;width:100%;display:inline-block}"]}),t})()}];let F=(()=>{class t{}return t.\u0275mod=c.Mb({type:t}),t.\u0275inj=c.Lb({factory:function(n){return new(n||t)},imports:[[i.d.forChild(w)],i.d]}),t})();r.d(n,"ForumExplorerModule",(function(){return x}));let x=(()=>{class t{}return t.\u0275mod=c.Mb({type:t}),t.\u0275inj=c.Lb({factory:function(n){return new(n||t)},imports:[[e.b,d.i,h.b,a.b,o.d,F]]}),t})()}}]);