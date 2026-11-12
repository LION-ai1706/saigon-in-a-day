import json
t=open('app.template.html').read()
places=json.load(open('places.json'))
for p in places:
    for k in ('coords_source','visit_minutes_source','meal_capable'):
        p.setdefault(k, None)
js=json.dumps(places,ensure_ascii=False).replace('</','<\\/')
t=t.replace('/*__PLACES__*/',js).replace('/*__ENGINE__*/',open('engine.js').read()).replace('/*__FAKE__*/',open('fake.js').read())
open('index.html','w').write(t); print(len(t))
