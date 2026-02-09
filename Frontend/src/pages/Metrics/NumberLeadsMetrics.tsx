import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import MonthlyMetricsTable from "../../components/metrics/MonthlyMetricsTable";

export default function NumberLeadsMetrics() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Número De Leads Por Mes" />
      <div className="space-y-6 mt-28 lg:mt-36 px-6 lg:px-10">
          <MonthlyMetricsTable />
      </div>
    </>
  );
}
