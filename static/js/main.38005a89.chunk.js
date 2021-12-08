(this["webpackJsonpexpenses-form"]=this["webpackJsonpexpenses-form"]||[]).push([[0],{156:function(e,n){var t=new Set(["REACT_APP_API_BASE_URL","REACT_APP_API_ADMIN_SECRET"]);n.default=t},192:function(e,n,t){var o={"./bg-BG.json":193,"./ca-ES.json":194,"./cs-CZ.json":195,"./de-DE.json":196,"./el-GR.json":197,"./en-US.json":154,"./es-ES.json":198,"./et-EE.json":199,"./fi-FI.json":200,"./fr-FR.json":201,"./he-IL.json":202,"./it-IT.json":203,"./ja-JP.json":204,"./ko-KR.json":205,"./nb-NO.json":206,"./nn-NO.json":207,"./pl-PL.json":208,"./pt-BR.json":209,"./ro-RO.json":210,"./ru-RU.json":211,"./sv-SE.json":212,"./tr-TR.json":213,"./zh-CN.json":214};function a(e){var n=i(e);return t(n)}function i(e){if(!t.o(o,e)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return o[e]}a.keys=function(){return Object.keys(o)},a.resolve=i,e.exports=a,a.id=192},217:function(e,n,t){},219:function(e,n,t){"use strict";t.r(n);var o=t(17),a=t(139),i=t(29),r=t(30),c=t(156),s=t.n(c).a.default;function u(e){!function(e){if(!s.has(e))throw new Error("Environment variable ".concat(e," must be whitelisted"))}(e);var n=Object({NODE_ENV:"production",PUBLIC_URL:"/expenses-form",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_ADMIN_SECRET:"eelFT66qv55iKIPJaOyFXz9AVplUyCkZ7hbhzhF2an7e13ro5Bd041OA6BhTGiKg",REACT_APP_API_BASE_URL:"https://dtg-expenses.hasura.app/v1"})[e];if(!n)throw new Error(["Environment variable ".concat(e," must be set."),"For more details, check ".concat("https://create-react-app.dev/docs/adding-custom-environment-variables/")].join(" "));return n}var d=function(){function e(){Object(i.a)(this,e)}return Object(r.a)(e,null,[{key:"asUrl",value:function(e){return u(e).replace(/\/$/,"")}}]),e}();s.forEach((function(e){if(void 0===Object({NODE_ENV:"production",PUBLIC_URL:"/expenses-form",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_ADMIN_SECRET:"eelFT66qv55iKIPJaOyFXz9AVplUyCkZ7hbhzhF2an7e13ro5Bd041OA6BhTGiKg",REACT_APP_API_BASE_URL:"https://dtg-expenses.hasura.app/v1"})[e])throw new Error("Environment variable ".concat(e," is missing"))}));var l,h=d,j=h.asUrl("REACT_APP_API_BASE_URL"),p=h.asUrl("REACT_APP_API_ADMIN_SECRET");!function(e){e.OAUTH_TOKEN="/auth/token/",e.OAUTH_VALIDATE_TOKEN="/api/v1/test/",e.USERS_TO_SUSPEND="/api/v1/users-to-suspend/"}(l||(l={}));var b,v,O,f=t(245),m=t(236),_=t(145),g=t(0),E=t.n(g),S=t(162),A=t(242),w=t(221),P=t(14),T={headers:{"x-hasura-admin-secret":p}},x=Object(_.a)(b||(b=Object(a.a)(["\n  query GetAllAccounts {\n    accounts {\n      id\n      name\n    }\n    currencies {\n      code\n    }\n  }\n"]))),C=Object(_.a)(v||(v=Object(a.a)(["\n  mutation AddExpense(\n    $paid_with: Int\n    $description: String\n    $currency: currencies_enum\n    $datetime: timestamptz\n    $amount: numeric\n  ) {\n    insert_expenses(\n      objects: {\n        amount: $amount\n        currency: $currency\n        description: $description\n        datetime: $datetime\n        paid_with: $paid_with\n      }\n    ) {\n      returning {\n        id\n      }\n    }\n  }\n"])));!function(e){e.date="date",e.paidWith="paidWith",e.amount="amount",e.currency="currency",e.description="description",e.pending="pending",e.shared="shared"}(O||(O={}));var R=function(){var e=Object(g.useState)("monzo"),n=Object(o.a)(e,2),t=n[0],a=n[1],i=Object(g.useState)(new Date),r=Object(o.a)(i,2),c=r[0],s=r[1],u=Object(g.useState)(),d=Object(o.a)(u,2),l=d[0],h=d[1],j=Object(g.useState)("GBP"),p=Object(o.a)(j,2),b=p[0],v=p[1],_=Object(g.useState)(),E=Object(o.a)(_,2),R=E[0],k=E[1],y=Object(g.useState)(!1),I=Object(o.a)(y,2),U=I[0],D=I[1],N=Object(g.useState)(!1),F=Object(o.a)(N,2),W=F[0],B=F[1],L=Object(g.useState)(!1),K=Object(o.a)(L,2),$=K[0],J=K[1],G=Object(g.useState)(),H=Object(o.a)(G,2),z=H[0],M=H[1],V=Object(f.a)(x,{context:T}),q=Object(o.a)(V,2),Z=q[0],X=q[1],Q=X.loading,Y=X.error,ee=X.data,ne=Object(m.a)(C,{context:T}),te=Object(o.a)(ne,1)[0];if(Object(g.useEffect)((function(){Z()}),[Z]),Y)return Object(P.jsxs)("div",{children:[Object(P.jsx)("h3",{children:"ERROR"}),Object(P.jsx)("pre",{children:JSON.stringify(Y,null,2)})]});var oe=null===ee||void 0===ee?void 0:ee.accounts.map((function(e){return e.name})).map((function(e){return{key:e,value:e,text:e}})),ae=null===ee||void 0===ee?void 0:ee.currencies.map((function(e){return e.code})).map((function(e){return{key:e,value:e,text:e}}));function ie(e,n){var t=n.name,o=n.value;if(console.debug("handleChange(name=".concat(t,", value=").concat(o,")")),void 0!==o)switch(t){case O.paidWith:a(o);break;case O.amount:h(Number(o));break;case O.description:k(o);break;case O.pending:D("true"===o);break;case O.shared:B("true"===o)}}return Object(P.jsxs)("div",{children:[Object(P.jsxs)(A.a,{loading:Q,onSubmit:function(){var e=ee.accounts.filter((function(e){return e.name===t}))[0].id;J(!0),te({variables:{paid_with:e,datetime:c,amount:l,currency:b,description:R||"",shared:W,pending:U}}).then((function(e){J(!1),console.dir(e),M(e)}))},children:[Object(P.jsx)(S.a,{onChange:function(e,n){console.dir(n.value),s(n.value)},value:c}),Object(P.jsx)(A.a.Dropdown,{label:"Paid with",name:O.paidWith,value:t,options:oe,inline:!0,onChange:function(e,n){a(n.value)}}),Object(P.jsxs)(A.a.Group,{inline:!0,children:[Object(P.jsx)(A.a.Input,{type:"number",placeholder:"Amount",name:O.amount,value:l,onChange:ie}),Object(P.jsx)(A.a.Dropdown,{name:O.currency,value:b,options:ae,onChange:function(e,n){v(n.value)}})]}),Object(P.jsx)(A.a.Input,{name:O.description,placeholder:"Foo with @JohnDoe,@JaneDoe at @BigCorp",value:R,onChange:ie}),Object(P.jsxs)(A.a.Group,{inline:!0,children:[Object(P.jsx)(A.a.Input,{type:"checkbox",label:"Shared",name:O.shared,value:!W,checked:W,onChange:ie}),Object(P.jsx)(A.a.Input,{type:"checkbox",label:"Pending",placeholder:"Pending",name:O.pending,value:!U,checked:U,onChange:ie}),Object(P.jsx)(w.a,{type:"submit",loading:$,children:"Add expense"})]})]}),Object(P.jsx)("pre",{children:JSON.stringify({paidWith:t,amount:l,currency:b,shared:W,pending:U,date:c},null,2)}),z?Object(P.jsx)("pre",{children:JSON.stringify(z,null,2)}):null]})},k=(t(217),function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,247)).then((function(n){var t=n.getCLS,o=n.getFID,a=n.getFCP,i=n.getLCP,r=n.getTTFB;t(e),o(e),a(e),i(e),r(e)}))}),y=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function I(e,n){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var t=e.installing;null!=t&&(t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."),n&&n.onUpdate&&n.onUpdate(e)):(console.log("Content is cached for offline use."),n&&n.onSuccess&&n.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var U=t(220),D=t(243),N=t(241),F=t(69),W=t.n(F),B=(t(218),new U.a({uri:"".concat(j,"/graphql"),cache:new D.a}));W.a.render(Object(P.jsx)(E.a.StrictMode,{children:Object(P.jsx)(N.a,{client:B,children:Object(P.jsx)(R,{})})}),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/expenses-form",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var n="".concat("/expenses-form","/service-worker.js");y?(!function(e,n){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(t){var o=t.headers.get("content-type");404===t.status||null!=o&&-1===o.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):I(e,n)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(n,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA")}))):I(n,e)}))}}(),k()}},[[219,1,2]]]);
//# sourceMappingURL=main.38005a89.chunk.js.map