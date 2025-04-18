import CodeTabContent from "@/components/CodeTabContent";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import VisualizeGraphColoring from "@/components/VisualizeGraphColoring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";



export default function Home() {
  return (
    <div className="bg-blue-950 p-2 text-white">
      <h1 className="text-center text-2xl md:text-5xl text-white p-5 font-semibold hover:text-neutral-300 hover:cursor-cell">Graph Coloring Simulator</h1>

      <Card className="my-1.5 p-10 bg-foreground text-white m-3 border-0 ">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Graph Coloring</CardTitle>
          <CardDescription>Assign colors to vertices of a graph such that no two adjacent vertices have the same color</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="explanation" className="w-full">
            <TabsList className="grid w-full grid-cols-3 	bg-gradient-to-r from-[#2c2f33] via-[#3a3f44] to-[#2c2f33] rounded-md text-muted-foreground py-1 px-2">
              <TabsTrigger value="explanation" className="hover:cursor-pointer data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-colors p-3">Explanation</TabsTrigger>
              <TabsTrigger value="code" className="hover:cursor-pointer data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-colors p-3">Code</TabsTrigger>
              <TabsTrigger value="simulation" className="hover:cursor-pointer data-[state=active]:bg-black data-[state=active]:text-white transition-colors rounded-md p-3">Simulation</TabsTrigger>
            </TabsList>

            <TabsContent value="explanation">
              <div className="my-2 p-6 border-gray-500 border">
                <h1 className="text-2xl font-bold mb-4 ">Algorithm</h1>
                <ol className="list-decimal list-inside space-y-2 ">
                  <li>Start with the first vertex of the graph.</li>
                  <li>Assign the first available color to the vertex that does not violate the coloring constraints (no two adjacent vertices can have the same color).</li>
                  <li>Move to the next vertex and repeat the process of assigning the first available color.</li>
                  <li>If all vertices are successfully colored, the algorithm terminates successfully.</li>
                  <li>If a vertex cannot be assigned any color without violating the constraints, backtrack to the previous vertex and try a different color.</li>
                  <li>Continue this process until all vertices are colored or it is determined that the graph cannot be colored with the given number of colors.</li>
                </ol>

                <h2 className="text-xl font-bold mt-6 mb-4">Time Complexity</h2>
                <p>The time complexity of the backtracking algorithm for graph coloring is O(m^V), where V is the number of vertices and m is the number of colors. This is because, in the worst case, the algorithm tries all possible color combinations for all vertices.</p>

                <h2 className="text-xl font-bold mt-6 mb-4">Advantages</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provides an exact solution to the graph coloring problem.</li>
                  <li>Can be used for small graphs where an optimal solution is required.</li>
                  <li>Flexible and can be adapted to different constraints and requirements.</li>
                </ul>

                <h2 className="text-xl font-bold mt-6 mb-4">Disadvantages</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Highly inefficient for large graphs due to its exponential time complexity.</li>
                  <li>Not suitable for real-time applications or scenarios with strict time constraints.</li>
                  <li>Requires significant computational resources for graphs with a large number of vertices or colors.</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="code">
              <CodeTabContent />
            </TabsContent>
            <TabsContent value="simulation">
              <div className="my-2 p-2.5 border-gray-500 border mx-auto">
                <VisualizeGraphColoring />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
