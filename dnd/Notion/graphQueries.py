INCLUDE_PARENTS = True
import json
with open("graph.json","r") as fl:
    data = json.load(fl)
names = {}
graph = {}
for node in data["edges"]:
    names[node] = data["names"][node]
    graph[node] = data["edges"][node]
for node in data["edges"]:
    if data["parents"][node]:
        graph[data["parents"][node]].append(node)
        if INCLUDE_PARENTS:
            graph[node].append(data["parents"][node])

ids = {v:k for k,v in names.items()}

from sys import setrecursionlimit
from collections import deque

setrecursionlimit(1000000000)
t = 0
ncomps = 0
val = [0]
z = []
def scc(g, f):
    val = {i:0 for i in g}
    comp = {i:-1 for i in g}
    def dfs(j, g, f):
        global t
        global ncomps
        t += 1
        low = val[j] = t
        x = 0
        cont = []
        z.append(j)
        for e in g[j]:
            if comp[e] < 0:low = min(low, val[e] if val[e] else dfs(e,g,f))
        if (low == val[j]):
            while True:
                x = z.pop()
                comp[x] = ncomps
                cont.append(x)
                if x == j:break
            f(cont); cont = []
            ncomps += 1
        val[j] = low
        return low
    for i in g:
        if (comp[i] < 0): dfs(i, g, f)
import heapq
def bfs(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    previous = {node: None for node in graph}
    pq = [(0, start)]
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        if current_distance > distances[current_node]:
            continue
        for neighbor in graph[current_node]:
            distance = current_distance + 1
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_node
                heapq.heappush(pq, (distance, neighbor))
    return distances, previous
def apsp(g):
    dists = {}
    for s in g:
        d = {s: 0}
        q = deque([s])
        while q:
            u = q.popleft()
            for v in g[u]:
                if v not in d:
                    d[v] = d[u] + 1
                    q.append(v)
        dists[s] = d
    return dists
def getPath(a,b):
    _,prev = bfs(graph,a)
    if not prev[b]:return []
    path = [b]
    while b != a:
        b = prev[b]
        path.append(b)
    return list(reversed(path))
def pagerank(g, d=0.85, tol=1e-9, max_iter=100):
    nodes = list(g)
    n = len(nodes)
    rank = {v: 1 / n for v in nodes}
    incoming = {v: [] for v in nodes}
    outdeg = {v: len(g[v]) for v in nodes}
    for u in nodes:
        for v in g[u]:
            incoming[v].append(u)
    for _ in range(max_iter):
        dangling = d * sum(rank[v] for v in nodes if outdeg[v] == 0) / n
        new = {}
        err = 0
        for v in nodes:
            r = (1 - d) / n + dangling
            for u in incoming[v]:
                r += d * rank[u] / outdeg[u]
            new[v] = r
            err += abs(r - rank[v])
        rank = new
        if err < tol:
            break
    return rank
sccs = []
scc(graph,lambda x:sccs.append(x))
dists = apsp(graph)

longest = []

for i in dists:
    for j in dists[i]:
        if dists[i][j]+1 > len(longest):
            longest = getPath(i,j)
print([names[i] for i in longest])

pageRanks = pagerank(graph)

rankSort = list(sorted(pageRanks.items(),key=lambda x:x[1],reverse=True))
print([(names[k],v) for k,v in rankSort[:10]])
print([names[i] for i in getPath(ids["The Bleaklands"],ids["The Elemental Council of Three"])])