import { Camera, LayoutListIcon, Leaf, MapIcon, MapPin, Volume2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Home() {
    return (
        <div className="overflow-y-scroll">
            <main className="container mx-auto p-4 pt-12 lg:px-12 xl:px-20 flex flex-col items-center justify-between">
                {/* Section Héro */}
                <section className="text-center mb-24 lg:mt-16">
                    <h1 className="text-4xl font-bold mb-8">
                        Découvrez et Suivez les Espèces Menacées dans Votre Région
                    </h1>
                    <p className="text-xl mb-12">
                        Téléchargez, suivez et apprenez sur les animaux et plantes autour de vous.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg" asChild>
                            <Link href="/feed">
                                <LayoutListIcon />
                                Voir les publications
                            </Link>
                        </Button>
                        <Button size="lg" asChild>
                            <Link href="/map">
                                <MapIcon />
                                Explorer la carte
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Section Fonctionnalités */}
                <section className="">
                    <h2 className="text-3xl font-semibold text-center mb-8">Fonctionnalités</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="h-6 w-6" />
                                    Télécharger des Observations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Capturez et partagez vos rencontres avec la faune avec la communauté.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-6 w-6" />
                                    Carte Interactive
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Consultez les observations de la faune sur une carte interactive et détaillée.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Leaf className="h-6 w-6" />
                                    Informations sur les Espèces
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Apprenez à connaître différentes espèces, y compris leur statut de conservation.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Volume2 className="h-6 w-6" />
                                    Sons des Animaux
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Écoutez des enregistrements des appels et chansons des différents animaux.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    );
}
