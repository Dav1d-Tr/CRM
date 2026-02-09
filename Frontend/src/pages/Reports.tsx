import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { BillIcon, Price, ShootingStarIcon, DemetalicosIcon, OrigamiIcon, PatternIcon, OriganicIcon, RackIcon, ExhibicionIcon, GondolasIcon, NewIcon, GenaeralIcon } from "../icons";

export default function Reports() {

    const [openCard, setOpenCard] = useState<"price" | "billed" | "general" | null>(null);

    const toggle = (card: "price" | "billed" | "general") => {
        setOpenCard(prev => prev === card ? null : card);
    };

    return (
        <>
            <PageMeta
                title="Reportes | CRM Demetalicos SAS"
                description="Listado de reportes"
            />

            <PageBreadcrumb pageTitle="Reportes" />

            <div className="space-y-6 mt-32 px-6 lg:px-10 grid gap-6">

                <article className="grid gap-6">
                    <strong className="text-2xl md:text-3xl text-gray-900 dark:text-white">
                        Reportes por estados
                    </strong>

                    {/* CARDS PRINCIPALES */}
                    <section className="flex flex-wrap gap-8">

                        <ComponentCard
                            icon={<GenaeralIcon />}
                            title="General"
                            information="Reportes generales de todo el CRM"
                            onClick={() => toggle("general")}
                        />

                        <ComponentCard
                            icon={<Price />}
                            title="Cotizado"
                            information="Reporte de leads cotizados"
                            onClick={() => toggle("price")}
                        />

                        <ComponentCard
                            icon={<BillIcon />}
                            title="Facturado"
                            information="Reporte de leads facturados"
                            onClick={() => toggle("billed")}
                        />
                    </section>

                    {/* DESPLEGABLE GENERAL */}
                    {openCard === "general" && (
                        <div className="p-6 rounded-2xl bg-gray-300 dark:bg-gray-950">
                            <strong className="text-lg md:text-2xl text-gray-900 dark:text-white">Reportes de cotización clasificados</strong>
                            <section className="flex flex-wrap gap-6 mt-4 animate-fadeIn mb-6">
                                <ComponentCard
                                    icon={<ShootingStarIcon />}
                                    title="General"
                                    information="Obten la información completa de todos los leads."
                                    link="/general"
                                />

                            </section>
                        </div>
                    )}

                    {/* DESPLEGABLE COTIZADO */}
                    {openCard === "price" && (
                        <div className="p-6 rounded-2xl bg-gray-300 dark:bg-gray-950">
                            <strong className="text-lg md:text-2xl text-gray-900 dark:text-white">Reportes de cotización clasificados</strong>
                            <section className="flex flex-wrap gap-6 mt-4 animate-fadeIn mb-6">
                                <ComponentCard
                                    icon={<ShootingStarIcon />}
                                    title="General"
                                    information="Todos los leads cotizados."
                                    link="/price"
                                />

                                <ComponentCard
                                    icon={<PatternIcon />}
                                    title="Pauta"
                                    information="Leads cotizados por pauta."
                                    link="/price?origin=pauta"
                                />

                                <ComponentCard
                                    icon={<OriganicIcon />}
                                    title="Organicos"
                                    information="Leads organicos cotizados."
                                    link="/price?origin=organico"
                                />

                                <ComponentCard
                                    icon={<OrigamiIcon />}
                                    title="Linea: Origami"
                                    information="Leads cotizados por la linea origami."
                                    link="/price?line=2"
                                />

                                <ComponentCard
                                    icon={<DemetalicosIcon />}
                                    title="Linea: Tradicional"
                                    information="Leads cotizados por la linea tradicional."
                                    link="/price?line=1"
                                />

                            </section>

                            <strong className="text-lg md:text-2xl text-gray-900 dark:text-white">Reportes de cotización clasificados de la linea tradicional</strong>

                            <section className="flex flex-wrap gap-6 mt-4 animate-fadeIn">

                                <ComponentCard
                                    icon={<RackIcon />}
                                    title="Estanterías"
                                    information="Leads cotizados por productos de estanterías."
                                    link="/price?category=2"
                                />

                                <ComponentCard
                                    icon={<GondolasIcon />}
                                    title="Góndolas"
                                    information="Leads cotizados por productos de góndolas."
                                    link="/price?category=3"
                                />

                                <ComponentCard
                                    icon={<ExhibicionIcon />}
                                    title="Exhibición"
                                    information="Leads cotizados por productos de exhibición."
                                    link="/price?category=4"
                                />

                                <ComponentCard
                                    icon={<NewIcon />}
                                    title="Producto Nuevo"
                                    information="Leads cotizados por productos nuevos."
                                    link="/price?category=5"
                                />

                            </section>
                        </div>
                    )}

                    {/* DESPLEGABLE FACTURADO */}
                    {openCard === "billed" && (
                        <div className="p-6 rounded-2xl bg-gray-300 dark:bg-gray-950">
                            <strong className="text-lg md:text-2xl text-gray-900 dark:text-white">Reportes de facturación clasificados</strong>
                            <section className="flex flex-wrap gap-6 mt-4 animate-fadeIn mb-6">
                                <ComponentCard
                                    icon={<ShootingStarIcon />}
                                    title="General"
                                    information="Todos los leads facturados."
                                    link="/billed"
                                />

                                <ComponentCard
                                    icon={<PatternIcon />}
                                    title="Pauta"
                                    information="Leads facturados por pauta."
                                    link="/billed?origin=pauta"
                                />

                                <ComponentCard
                                    icon={<OriganicIcon />}
                                    title="Organicos"
                                    information="Leads facturados cotizados."
                                    link="/billed?origin=organico"
                                />

                                <ComponentCard
                                    icon={<OrigamiIcon />}
                                    title="Linea: Origami"
                                    information="Leads facturados por la linea origami."
                                    link="/billed?line=2"
                                />

                                <ComponentCard
                                    icon={<DemetalicosIcon />}
                                    title="Linea: Tradicional"
                                    information="Leads facturados por la linea tradicional."
                                    link="/billed?line=1"
                                />

                            </section>

                            <strong className="text-lg md:text-2xl text-gray-900 dark:text-white">Reportes de facturación clasificados de la linea tradicional</strong>

                            <section className="flex flex-wrap gap-6 mt-4 animate-fadeIn">

                                <ComponentCard
                                    icon={<RackIcon />}
                                    title="Estanterías"
                                    information="Leads facturados por productos de estanterías."
                                    link="/billed?category=2"
                                />

                                <ComponentCard
                                    icon={<GondolasIcon />}
                                    title="Góndolas"
                                    information="Leads facturados por productos de góndolas."
                                    link="/billed?category=3"
                                />

                                <ComponentCard
                                    icon={<ExhibicionIcon />}
                                    title="Exhibición"
                                    information="Leads facturados por productos de exhibición."
                                    link="/billed?category=4"
                                />

                                <ComponentCard
                                    icon={<NewIcon />}
                                    title="Producto Nuevo"
                                    information="Leads facturados por productos nuevos."
                                    link="/billed?category=5"
                                />

                            </section>
                        </div>
                    )}

                </article>
            </div>
        </>
    );
}
