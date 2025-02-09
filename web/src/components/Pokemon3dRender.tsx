"use client";

import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

export default function Pokemon3dRender({ base64model }: { base64model: string }) {
    const { scene } = useGLTF(base64model);

    // Rotate the model continuously using useFrame
    useFrame(() => {
        scene.rotation.y += 0.005; // Adjust this value for speed of rotation
    });

    return (
        <Canvas camera={{ position: [0, 0.5, 1.5] }}>
            {/* Lighting Setup */}
            <ambientLight intensity={10} /> {/* Adds soft ambient light */}
            <directionalLight position={[10, 10, 5]} intensity={11} /> {/* Adds directional light */}
            <pointLight position={[0, 5, 0]} intensity={10} /> {/* Adds a point light for more brightness */}
            {/* Local environment setup */}
            <Environment preset="park" background />
            <OrbitControls enableZoom={false} />
            <primitive object={scene} scale={1.5} rotation={[0.2, Math.PI, 0]} />
        </Canvas>
    );
}
