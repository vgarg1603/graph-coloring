"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Node {
    id: number;
    x: number;
    y: number;
}

interface Edge {
    from: number;
    to: number;
}

type Step = {
    nodeId: number;
    colorIndex: number;
    type: "assign" | "unassign";
};

const FULL_COLOR_PALETTE = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#4db6ac"];

export default function VisualizeBacktrackingGraphColoring() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [colors, setColors] = useState<number[]>([]);
    const [selectedNode, setSelectedNode] = useState<number | null>(null);
    const [maxColors, setMaxColors] = useState(4);
    const [steps, setSteps] = useState<Step[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [message, setMessage] = useState("");
    const svgRef = useRef<SVGSVGElement>(null);
    const colorPalette = FULL_COLOR_PALETTE.slice(0, maxColors);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const generateSteps = () => {
        const newSteps: Step[] = [];
        const nodeColors = Array(nodes.length).fill(-1);

        const isSafe = (nodeIndex: number, color: number): boolean => {
            for (const edge of edges) {
                const neighbor = edge.from === nodeIndex ? edge.to : edge.to === nodeIndex ? edge.from : null;
                if (neighbor !== null && nodeColors[neighbor] === color) return false;
            }
            return true;
        };

        const solve = (nodeIndex: number): boolean => {
            if (nodeIndex === nodes.length) return true;

            for (let color = 0; color < maxColors; color++) {
                if (isSafe(nodeIndex, color)) {
                    nodeColors[nodeIndex] = color;
                    newSteps.push({ nodeId: nodeIndex, colorIndex: color, type: "assign" });

                    if (solve(nodeIndex + 1)) return true;

                    nodeColors[nodeIndex] = -1;
                    newSteps.push({ nodeId: nodeIndex, colorIndex: -1, type: "unassign" });
                }
            }

            return false;
        };

        const hasSolution = solve(0);

        if (!hasSolution) {
            newSteps.push({ nodeId: -1, colorIndex: -1, type: "unassign" });
        }

        return newSteps;
    };

    const handlePlay = async () => {
        if (!steps.length) {
            const newSteps = generateSteps();
            setSteps(newSteps);
            setStepIndex(0);
            setColors(Array(nodes.length).fill(-1));
            setIsPlaying(true);
            await runSteps(newSteps);
        } else {
            setIsPlaying(true);
            await runSteps(steps.slice(stepIndex));
        }
    };

    const runSteps = async (stepsToRun: Step[]) => {
        for (let i = 0; i < stepsToRun.length; i++) {
            const step = stepsToRun[i];
            setStepIndex((prev) => prev + 1);

            if (step.nodeId === -1) {
                setMessage("⛔ No valid coloring found. Backtracking failed.");
                break;
            }

            setColors((prevColors) => {
                const newColors = [...prevColors];
                newColors[step.nodeId] = step.colorIndex;
                return newColors;
            });

            setMessage(
                step.type === "assign"
                    ? `🎨 Assigning color ${step.colorIndex + 1} to node ${step.nodeId}`
                    : `❌ Backtracking from node ${step.nodeId}`
            );

            await sleep(1000);
        }

        setIsPlaying(false);
    };

    const handleReset = () => {
        setNodes([]);
        setEdges([]);
        setColors([]);
        setSteps([]);
        setStepIndex(0);
        setIsPlaying(false);
        setSelectedNode(null);
        setMessage("🔁 Graph reset.");
    };

    const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = nodes.length;

        setNodes([...nodes, { id, x, y }]);
        setColors((prev) => [...prev, -1]);
        setSteps([]);
        setStepIndex(0);
        setIsPlaying(false);
    };

    const handleNodeClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.shiftKey) {
            const newNodes = nodes.filter((n) => n.id !== id);
            const newEdges = edges.filter((e) => e.from !== id && e.to !== id);
            const newColors = colors.filter((_, i) => i !== id);
            setNodes(newNodes);
            setEdges(newEdges);
            setColors(newColors);
            setSteps([]);
            setStepIndex(0);
            setIsPlaying(false);
            return;
        }

        if (selectedNode === null) {
            setSelectedNode(id);
        } else if (selectedNode !== id) {
            const exists = edges.some(
                (e) => (e.from === selectedNode && e.to === id) || (e.to === selectedNode && e.from === id)
            );
            if (!exists) {
                setEdges([...edges, { from: selectedNode, to: id }]);
            }
            setSelectedNode(null);
        }
    };

    const updateNodePosition = (index: number, x: number, y: number) => {
        const newNodes = [...nodes];
        newNodes[index] = { ...newNodes[index], x, y };
        setNodes(newNodes);
    };

    const handleGenerateRandom = () => {
        const numNodes = 6;
        const nodeList: Node[] = [];
        const edgeList: Edge[] = [];

        for (let i = 0; i < numNodes; i++) {
            nodeList.push({
                id: i,
                x: Math.random() * 500 + 50,
                y: Math.random() * 400 + 50,
            });
        }

        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.random() < 0.3) {
                    edgeList.push({ from: i, to: j });
                }
            }
        }

        setNodes(nodeList);
        setEdges(edgeList);
        setColors(Array(numNodes).fill(-1));
        setSteps([]);
        setStepIndex(0);
        setIsPlaying(false);
    };

    return (
        <div className="max-w-6xl w-full mx-auto py-6 px-4 flex flex-col gap-6">
            <Card className="bg-gradient-to-b from-[#1e1e1e] to-[#2a2a2a]">
                <CardContent className="py-4 flex flex-wrap items-center gap-4 ">
                    <Button onClick={handlePlay} disabled={!nodes.length || isPlaying}>▶️ Play</Button>
                    <Button variant="secondary" onClick={handleReset}>🔄 Reset</Button>
                    <Button variant="outline" onClick={handleGenerateRandom}>🎲 Random Graph</Button>
                    <div className="flex items-center gap-2 bg-white rounded-lg pl-1">
                        <label className="text-sm font-medium">🎨 Max Colors:</label>
                        <Select value={maxColors.toString()} onValueChange={(val) => {
                            const newMax = parseInt(val);
                            setMaxColors(newMax);
                            setColors(Array(nodes.length).fill(-1));
                            setSteps([]);
                            setStepIndex(0);
                            setIsPlaying(false);
                        }}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="Colors" />
                            </SelectTrigger>
                            <SelectContent>
                                {[...Array(6)].map((_, i) => (
                                    <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-[#1e1e1e] to-[#2a2a2a]">
                <CardContent className=" text-white text-center">
                    {message || "💡 Click to add nodes. Click two nodes to connect. Shift+Click to delete. Drag to reposition."}
                </CardContent>
            </Card>

            <div className="border border-gray-500 rounded-lg overflow-hidden">
                <svg
                    ref={svgRef}
                    width="100%"
                    height="500"
                    className="bg-neutral-900 w-full"
                    onClick={handleSvgClick}
                >
                    {edges.map((edge, i) => {
                        const from = nodes[edge.from];
                        const to = nodes[edge.to];
                        return (
                            <line
                                key={i}
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                stroke="#aaa"
                                strokeWidth="2"
                            />
                        );
                    })}

                    {nodes.map((node, idx) => (
                        <motion.g
                            key={node.id}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                const startX = e.clientX;
                                const startY = e.clientY;
                                const nodeIndex = nodes.findIndex((n) => n.id === node.id);

                                const onMouseMove = (moveEvent: MouseEvent) => {
                                    const dx = moveEvent.clientX - startX;
                                    const dy = moveEvent.clientY - startY;
                                    const rect = svgRef.current?.getBoundingClientRect();
                                    if (!rect) return;
                                    updateNodePosition(nodeIndex, node.x + dx, node.y + dy);
                                };

                                const onMouseUp = () => {
                                    document.removeEventListener("mousemove", onMouseMove);
                                    document.removeEventListener("mouseup", onMouseUp);
                                };

                                document.addEventListener("mousemove", onMouseMove);
                                document.addEventListener("mouseup", onMouseUp);
                            }}
                            onClick={(e) => handleNodeClick(node.id, e)}
                        >
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r="25"
                                animate={{
                                    fill: colors[idx] === -1 ? "#444" : colorPalette[colors[idx]],
                                }}
                                transition={{ duration: 0.4 }}
                                stroke={selectedNode === node.id ? "#fff" : "#aaa"}
                                strokeWidth="3"
                            />
                            <text
                                x={node.x}
                                y={node.y + 6}
                                textAnchor="middle"
                                fontSize="16"
                                fill="#fff"
                            >
                                {node.id}
                            </text>
                        </motion.g>
                    ))}
                </svg>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-white">Available Colors:</span>
                {colorPalette.map((color, i) => (
                    <Badge key={i} className="rounded-full" style={{ backgroundColor: color }}>
                        {i + 1}
                    </Badge>
                ))}
            </div>
        </div>
    );
}