import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filterProperties } from '../src/lib/search.js'
import { trackEvent, installWhatsAppTracking } from '../src/lib/analytics.js'
const properties = [0,300000,300001,600000,600001,null].map((price,i) => ({id:i,price,city:'São Leopoldo',neighborhood:'São José',category:'casas'}))
test('price boundaries do not overlap and unknown prices are excluded from a budget', () => {
 assert.deepEqual(filterProperties(properties,{priceBand:'ate-300'}).map(p=>p.id),[0,1])
 assert.deepEqual(filterProperties(properties,{priceBand:'300-600'}).map(p=>p.id),[2,3])
 assert.deepEqual(filterProperties(properties,{priceBand:'acima-600'}).map(p=>p.id),[4])
 assert.equal(filterProperties(properties,{}).length,6)
})
test('location is accent-insensitive, category filters work and examples never appear',()=>{
 assert.equal(filterProperties(properties,{location:'SAO JOSE'}).length,6)
 assert.equal(filterProperties(properties,{type:'apartamentos'}).length,0)
 assert.equal(filterProperties([{...properties[0],isExample:true}],{}).length,0)
})
test('analytics respects consent and strips names, messages and URLs',()=>{
 global.window={location:{pathname:'/casas'}}
 trackEvent('whatsapp_click',{name:'private'})
 assert.equal(window.dataLayer,undefined)
 window.schayAnalyticsConsent=true
 trackEvent('whatsapp_click',{name:'private',message:'private',url:'private',placement:'hero'})
 assert.deepEqual(window.dataLayer,[{event:'whatsapp_click',page_path:'/casas',placement:'hero'}])
 delete global.window
})
test('one delegated event per WhatsApp click with cleanup',()=>{
 const listeners=new Set()
 global.document={addEventListener:(_,f)=>listeners.add(f),removeEventListener:(_,f)=>listeners.delete(f)}
 global.window={schayAnalyticsConsent:true,location:{pathname:'/',href:'https://schaycorretora.com.br/'}}
 const stop=installWhatsAppTracking()
 const link={href:'https://wa.me/5551992789076?text=Private',dataset:{propertyId:'casa-03',placement:'property_card'},closest:()=>null}
 for(const fn of listeners)fn({target:{closest:()=>link}})
 assert.equal(window.dataLayer.length,1)
 assert.equal(window.dataLayer[0].property_id,'casa-03')
 assert.equal(JSON.stringify(window.dataLayer).includes('Private'),false)
 stop();assert.equal(listeners.size,0)
 delete global.window;delete global.document
})
