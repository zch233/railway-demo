var y=(u,a,r)=>new Promise((s,i)=>{var p=l=>{try{t(r.next(l))}catch(m){i(m)}},e=l=>{try{t(r.throw(l))}catch(m){i(m)}},t=l=>l.done?s(l.value):Promise.resolve(l.value).then(p,e);t((r=r.apply(u,a)).next())});import{_ as D,a as b}from"./2cf6fe9d.js";import{u as g,G as Y}from"./1007c9c8.js";import{_ as h}from"./f08efacc.js";import{Q as M,r as d,O as k,b0 as c,d as o,j as n,b3 as v,l as f,F as C,B as _}from"./2f07c074.js";import{w as F}from"./0e813efd.js";import"./89b58949.js";import"./35503dd9.js";/* empty css        */import"./ef14c475.js";const B=M({name:"OrderList",setup(){const u=d(),a=d(),r=g(),s=d({}),i=k(()=>{const e=r.orderList.filter(t=>s.value.type?t.type===s.value.type:!0).filter(t=>s.value.day?c(t.day).format("YYYY-MM-DD")===s.value.day:!0).reverse();return{list:e,total:e.length}}),p=k(()=>[{key:"day",type:"datePicker",props:{valueFormat:"YYYY-MM-DD",placeholder:"\u8BF7\u9009\u62E9\u64CD\u4F5C\u65E5\u671F"}},{key:"type",type:"select",props:{placeholder:"\u8BF7\u9009\u62E9\u7C7B\u578B",showSearch:!0,options:[{value:"1",label:"\u6062\u590D"},{value:"0",label:"\u505C\u8FD0"}]}}]);return()=>o("div",{class:"container"},[o(D,{itemConfigs:p.value,onSearch:e=>{s.value=e,a.value.refresh()}},null),o(b,{ref:a,tableTitle:"\u8C03\u4EE4\u8BB0\u5F55",columns:[{key:"day",title:"\u64CD\u4F5C\u65E5\u671F",customRender:({text:e})=>c(e).format("YYYY-MM-DD")},{key:"type",title:"\u7C7B\u578B",customRender:({text:e})=>e==="1"?o(Y,{color:"green"},{default:()=>[n("\u6062\u590D")]}):o(Y,{color:"red"},{default:()=>[n("\u505C\u8FD0")]})},{key:"time",title:"\u751F\u6548\u65E5\u671F",customRender:({text:e})=>e.join(" \u81F3 ")},{key:"list",title:"\u8F66\u6B21",customRender:({text:e})=>e.join(",")},{key:"options",title:"\u64CD\u4F5C",customRender:({record:e})=>o("div",{class:"operate"},[o("span",{class:"pointer",onClick:()=>u.value.init(e)},[n("\u7F16\u8F91")]),o("span",{class:"pointer error",onClick:()=>{v.confirm({title:"\u63D0\u793A",content:"\u786E\u8BA4\u8981\u5220\u9664\u5417\uFF1F",onOk:()=>{r.setOrderList(r.orderList.filter(t=>t.day!==e.day)),a.value.refresh(),f.success("\u5220\u9664\u6210\u529F")}})}},[n("\u5220\u9664")])])}],operationRender:()=>o(C,null,[o(_,{type:"primary",danger:!0,onClick:()=>{v.confirm({title:"\u63D0\u793A",content:"\u786E\u8BA4\u8981\u5220\u9664\u5417\uFF1F",onOk:()=>{r.setOrderList([]),a.value.refresh(),f.success("\u6E05\u7A7A\u6210\u529F")}})}},{default:()=>[n("\u6E05\u7A7A")]}),o(_,{type:"primary",onClick:()=>{const e=document.createElement("a");e.href=URL.createObjectURL(F(i.value.list.map(t=>({\u64CD\u4F5C\u65E5\u671F:c(t.day).format("YYYY\u5E74MM\u6708DD\u65E5"),\u7C7B\u578B:t.type==="1"?"\u6062\u590D":"\u505C\u8FD0",\u751F\u6548\u65E5\u671F:t.time.join(" \u81F3 "),\u8F66\u6B21:t.list.join(",")})))),e.download=`\u8C03\u4EE4\u8BB0\u5F55${c().format("YYYY-MM-DD HH-mm-ss")}.xlsx`,document.body.appendChild(e),e.click(),e.remove(),f.success("\u5BFC\u51FA\u6210\u529F")}},{default:()=>[n("\u5BFC\u51FA")]})]),listApi:()=>y(this,null,function*(){return{data:i.value}})},null),o(h,{ref:u,onSuccess:()=>{a.value.refresh()}},null)])}});export{B as default};
