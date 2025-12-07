"use client"

import type React from "react"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Stars } from "@react-three/drei"
import * as THREE from "three"

// Floating particle system that follows cursor
function ParticleField({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
    const particlesRef = useRef<THREE.Points>(null)
    const count = 500

    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const vel = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20
            vel[i * 3] = (Math.random() - 0.5) * 0.02
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02
        }
        return [pos, vel]
    }, [])

    const sizes = useMemo(() => {
        const s = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            s[i] = Math.random() * 2 + 0.5
        }
        return s
    }, [])

    useFrame((state) => {
        if (!particlesRef.current) return
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
        const time = state.clock.elapsedTime

        for (let i = 0; i < count; i++) {
            const i3 = i * 3

            // Mouse attraction
            const dx = mousePosition.current.x * 5 - positions[i3]
            const dy = mousePosition.current.y * 5 - positions[i3 + 1]
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < 3) {
                positions[i3] += dx * 0.01
                positions[i3 + 1] += dy * 0.01
            }

            // Gentle floating motion
            positions[i3] += Math.sin(time + i * 0.1) * 0.002 + velocities[i3]
            positions[i3 + 1] += Math.cos(time + i * 0.1) * 0.002 + velocities[i3 + 1]
            positions[i3 + 2] += Math.sin(time * 0.5 + i) * 0.001

            // Boundary wrap
            if (positions[i3] > 10) positions[i3] = -10
            if (positions[i3] < -10) positions[i3] = 10
            if (positions[i3 + 1] > 10) positions[i3 + 1] = -10
            if (positions[i3 + 1] < -10) positions[i3 + 1] = 10
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#22d3ee"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

// Glowing orb that follows cursor
function CursorOrb({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current || !glowRef.current) return

        // Smooth follow cursor
        meshRef.current.position.x += (mousePosition.current.x * 3 - meshRef.current.position.x) * 0.05
        meshRef.current.position.y += (mousePosition.current.y * 3 - meshRef.current.position.y) * 0.05
        meshRef.current.position.z = -2 + Math.sin(state.clock.elapsedTime) * 0.2

        glowRef.current.position.copy(meshRef.current.position)

        // Pulse effect
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
        meshRef.current.scale.setScalar(scale)
        glowRef.current.scale.setScalar(scale * 2)
    })

    return (
        <>
            <mesh ref={meshRef} position={[0, 0, -2]}>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
            </mesh>
            <mesh ref={glowRef} position={[0, 0, -2]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
            </mesh>
        </>
    )
}

// Floating neural network nodes
function NeuralNodes({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
    const groupRef = useRef<THREE.Group>(null)
    const nodes = useMemo(() => {
        const n = []
        for (let i = 0; i < 8; i++) {
            n.push({
                position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4 - 3] as [
                    number,
                    number,
                    number,
                ],
                scale: Math.random() * 0.3 + 0.1,
                speed: Math.random() * 0.5 + 0.5,
                color: Math.random() > 0.5 ? "#22d3ee" : "#a855f7",
            })
        }
        return n
    }, [])

    useFrame((state) => {
        if (!groupRef.current) return
        groupRef.current.rotation.y = mousePosition.current.x * 0.2
        groupRef.current.rotation.x = mousePosition.current.y * 0.1
    })

    return (
        <group ref={groupRef}>
            {nodes.map((node, i) => (
                <Float key={i} speed={node.speed} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={node.position}>
                        <octahedronGeometry args={[node.scale, 0]} />
                        <meshBasicMaterial color={node.color} wireframe transparent opacity={0.7} />
                    </mesh>
                    {/* Glow */}
                    <mesh position={node.position}>
                        <octahedronGeometry args={[node.scale * 1.5, 0]} />
                        <meshBasicMaterial color={node.color} transparent opacity={0.1} />
                    </mesh>
                </Float>
            ))}
            {/* Connection lines */}
            <LineConnections nodes={nodes} />
        </group>
    )
}

// Lines connecting neural nodes
function LineConnections({ nodes }: { nodes: { position: [number, number, number] }[] }) {
    const linesRef = useRef<THREE.LineSegments>(null)

    const geometry = useMemo(() => {
        const points: number[] = []
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() > 0.5) {
                    points.push(...nodes[i].position, ...nodes[j].position)
                }
            }
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3))
        return geo
    }, [nodes])

    useFrame((state) => {
        if (!linesRef.current) return
        const material = linesRef.current.material as THREE.LineBasicMaterial
        material.opacity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05
    })

    return (
        <lineSegments ref={linesRef} geometry={geometry}>
            <lineBasicMaterial color="#22d3ee" transparent opacity={0.15} />
        </lineSegments>
    )
}

// Animated grid floor
function GridFloor({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
    const gridRef = useRef<THREE.GridHelper>(null)

    useFrame((state) => {
        if (!gridRef.current) return
        gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2
        gridRef.current.rotation.x = Math.PI / 2 - 0.3 + mousePosition.current.y * 0.1
    })

    return (
        <gridHelper
            ref={gridRef}
            args={[40, 40, "#22d3ee", "#1e3a5f"]}
            position={[0, -5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
        />
    )
}

// Main scene component
function Scene({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
    const { camera } = useThree()

    useFrame(() => {
        // Subtle camera movement based on mouse
        camera.position.x += (mousePosition.current.x * 0.5 - camera.position.x) * 0.02
        camera.position.y += (mousePosition.current.y * 0.3 - camera.position.y) * 0.02
        camera.lookAt(0, 0, 0)
    })

    return (
        <>
            <color attach="background" args={["#050510"]} />
            <fog attach="fog" args={["#050510", 5, 25]} />

            <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={1} />

            <ParticleField mousePosition={mousePosition} />
            <CursorOrb mousePosition={mousePosition} />
            <NeuralNodes mousePosition={mousePosition} />
            <GridFloor mousePosition={mousePosition} />

            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />
        </>
    )
}

export function ThreeBackground() {
    const mousePosition = useRef({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent) => {
        // Normalize mouse position to -1 to 1
        mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1
        mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    return (
        <div className="fixed inset-0 pointer-events-auto z-0" onMouseMove={handleMouseMove}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                <Scene mousePosition={mousePosition} />
            </Canvas>
        </div>
    )
}
