distribution = "uniform" # "uniform" or "two fair"
n = 6
def solveFromFirst(first,remaining):
    n = len(first)
    currentDist = targetDist[:]
    outp = []
    currentCount = 0
    while True:
        i = -1
        for j in range(len(currentDist)):
            if currentDist[j] > 0:
                i = j
                break
            if currentDist[j] < 0: return False
        if i == -1: break
        i -= first[0]
        outp.append(i)
        currentCount += i
        for j in first:
            if i+j > 2*n: return False
            currentDist[i+j] -= 1
        if currentCount > remaining: return False
    if all(i == 0 for i in currentDist):
        return outp
    return False

def solveAllRecurse(cur,n,t):
    if (t < 0): return []
    if len(cur) == n:
        res = solveFromFirst(cur,t)
        if res: return [(cur[:],res)]
        return []
    if (t == 0): return []
    results = []
    for i in range(([1]+cur)[-1],n+1):
        cur.append(i)
        results.extend(solveAllRecurse(cur,n,t-i))
        cur.pop()
    return results

if distribution == "two fair":
    targetDist = [0]*(2*n+1)
    c = 1
    for i in range(2,2*n+1):
        targetDist[i] = c
        if i <= n: c += 1
        else: c -= 1
elif distribution == "uniform":
    targetDist = [0]+[n//2]*(2*n)
total = sum(i*j for i,j in enumerate(targetDist))//(n)

def solveAll(n):
    return solveAllRecurse([],n,total)

print("\n".join(map(str,solveAll(n))))