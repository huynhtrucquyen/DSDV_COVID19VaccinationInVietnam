import os

f = open("linedatanewwwFinal.csv", "r")

f = f.readlines()

people_vaccinated = []
people_fully_vaccinated = []

for (idx, row) in enumerate(f):
    if idx == 0: continue
    # print(row.split(','))
    row = row.split(',')
    people_vaccinated.append([row[0], row[1]])
    people_fully_vaccinated.append([row[0], row[3]])
# print(f[33].split(','))


output = open("QNgox.csv", "w")
preX, preY = '0', '0' 
for v in people_vaccinated:
    if v[1] == '0': v[1] = preX
    output.write("people_vaccinated" +','+v[0]+',' +v[1]+'\n' )
    preX = v[1]
    
for v in people_fully_vaccinated:
    if v[1] == '0': v[1] = preY
    output.write("people_fully_vaccinated" +','+v[0]+',' +v[1]+'\n' )
    preY = v[1]


print(people_fully_vaccinated)