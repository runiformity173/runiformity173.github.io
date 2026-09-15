ROLL_LITERAL = "2+coin()+coin()+2*coin()+2*coin()"
SIMS = 10000

from random import randint
from re import findall
def highest(group,n=1):
    return sum(list(sorted(group))[-n:])
def lowest(group,n=1):
    return sum(list(sorted(group))[:n])
def coinFlips():
    total = 0
    while randint(0,1) == 1:
        total += 1
    return total
def coin(): return randint(0,1)
roll = lambda num,sides: sum(randint(1,sides) for i in range(num))

def evaluateLiteral(literal):
    for i in findall(r"\d+d\d+",literal):
        literal = literal.replace(i,str(roll(*map(int,i.split("d")))),count=1)
    return eval(literal)

minRoll = float("inf")
maxRoll = float("-inf")

distribution = {}

for _ in range(SIMS):
    res = evaluateLiteral(ROLL_LITERAL)
    if res < minRoll: minRoll = res
    if res > maxRoll: maxRoll = res
    if res in distribution: distribution[res] += 1
    else: distribution[res] = 1

for i in range(minRoll,maxRoll+1):
    amt = 0
    if i in distribution: amt = distribution[i]
    print(f"{i}|{amt}")