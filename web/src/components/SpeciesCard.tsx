"use client";

import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";

function AnimalModel() {
    const { scene } = useGLTF("/models/birb.glb");

    // Rotate the model continuously using useFrame
    useFrame(() => {
        scene.rotation.y += 0.005; // Adjust this value for speed of rotation
    });

    return <primitive object={scene} scale={1.5} rotation={[0.2, Math.PI, 0]} />;
}

export default function AnimalCard() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex justify-center items-center h-screen">
            <Button onClick={() => setIsOpen(true)}>View Animal</Button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-lg w-96"
                    >
                        <div className="w-full h-64">
                            <Canvas camera={{ position: [0, 0.5, 1.5] }}>
                                {/* Lighting Setup */}
                                <ambientLight intensity={10} /> {/* Adds soft ambient light */}
                                <directionalLight position={[10, 10, 5]} intensity={11} />{" "}
                                {/* Adds directional light */}
                                <pointLight position={[0, 5, 0]} intensity={10} />{" "}
                                {/* Adds a point light for more brightness */}
                                {/* Local environment setup */}
                                <Environment preset="park" background />
                                <OrbitControls enableZoom={false} />
                                <AnimalModel />
                            </Canvas>
                        </div>
                        <h2 className="text-lg font-semibold mt-4">Birb</h2>
                        <p className="text-gray-600">This is a cute birb model loaded from the public folder.</p>
                        <Button className="mt-4" onClick={() => setIsOpen(false)}>
                            Close
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
