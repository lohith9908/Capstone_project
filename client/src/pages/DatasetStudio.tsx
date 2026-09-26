import React, { useState, useEffect } from 'react';
import { datasetApi } from '../services/api';
import { IDataset, IDatasetSample, SampleLabel } from '../types';
import { Badge } from '../components/common/Badge';
import { Database, Upload, RefreshCw } from 'lucide-react';

export const DatasetStudio: React.FC = () => {
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [samples, setSamples] = useState<IDatasetSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [labelFilter, setLabelFilter] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form
  const [uploadName, setUploadName] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCsv, setUploadCsv] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const loadDatasets = async () => {
    try {
      const list = await datasetApi.getDatasets();
      setDatasets(list);
      if (list.length > 0 && !selectedDatasetId) {
        setSelectedDatasetId(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load datasets', err);
    }
  };

  const loadSamples = async (datasetId: string, p = 1, filter = '') => {
    if (!datasetId) return;
    setLoading(true);
    try {
      const data = await datasetApi.getSamples(datasetId, p, 10, filter || undefined);
      setSamples(data.samples);
      setTotalPages(data.pagination.totalPages || 1);
      setPage(data.pagination.page || 1);
    } catch (err) {
      console.error('Failed to load samples', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  useEffect(() => {
    if (selectedDatasetId) {
      loadSamples(selectedDatasetId, page, labelFilter);
    }
  }, [selectedDatasetId, page, labelFilter]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadError('');
    try {
      await datasetApi.uploadCsv(uploadName, uploadDesc, uploadCsv);
      setShowUploadModal(false);
      setUploadName('');
      setUploadDesc('');
      setUploadCsv('');
      await loadDatasets();
    } catch (err: any) {
      setUploadError(err.response?.data?.error?.message || 'Failed to upload CSV dataset');
    } finally {
      setUploadLoading(false);
    }
  };

  const currentDataset = datasets.find((d) => d._id === selectedDatasetId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Database className="w-6 h-6 text-cyan-400" />
            <span>Dataset & Feature Vector Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse static PE feature vectors, examine distribution statistics, or import custom datasets.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload CSV Feature Vector</span>
        </button>
      </div>

      {/* Dataset Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {datasets.map((d) => (
          <div
            key={d._id}
            onClick={() => {
              setSelectedDatasetId(d._id);
              setPage(1);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedDatasetId === d._id
                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{d.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.description || 'Synthetic static PE vectors'}</p>
              </div>
              {d.isDemo && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  DEMO
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-2">
              <span>{d.sampleCount} Samples</span>
              <span>15 Features</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sample Explorer Table */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              {currentDataset?.name || 'Dataset'} Samples
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Inspecting individual 15-feature Portable Executable records</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => { setLabelFilter(''); setPage(1); }}
                className={`px-3 py-1 rounded-md font-mono ${labelFilter === '' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
              >
                ALL
              </button>
              <button
                onClick={() => { setLabelFilter(SampleLabel.MALWARE); setPage(1); }}
                className={`px-3 py-1 rounded-md font-mono ${labelFilter === SampleLabel.MALWARE ? 'bg-red-500/20 text-red-400' : 'text-slate-400'}`}
              >
                MALWARE
              </button>
              <button
                onClick={() => { setLabelFilter(SampleLabel.BENIGN); setPage(1); }}
                className={`px-3 py-1 rounded-md font-mono ${labelFilter === SampleLabel.BENIGN ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
              >
                BENIGN
              </button>
            </div>

            <button
              onClick={() => loadSamples(selectedDatasetId, page, labelFilter)}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center text-slate-500 font-mono text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
            Querying MongoDB sample records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                <tr>
                  <th className="py-3 px-3">Sample ID</th>
                  <th className="py-3 px-3">Label</th>
                  <th className="py-3 px-3">Entropy</th>
                  <th className="py-3 px-3">File Size</th>
                  <th className="py-3 px-3">Imports</th>
                  <th className="py-3 px-3">Suspicious APIs</th>
                  <th className="py-3 px-3">Packed</th>
                  <th className="py-3 px-3">Cert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {samples.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 text-slate-500">{s._id.substring(0, 8)}...</td>
                    <td className="py-3 px-3">
                      <Badge
                        label={s.label}
                        variant={s.label === SampleLabel.MALWARE ? 'danger' : 'success'}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{s.features.entropy}</td>
                    <td className="py-3 px-3 text-slate-400">{(s.features.fileSize / 1024).toFixed(1)} KB</td>
                    <td className="py-3 px-3 text-slate-400">{s.features.importCount}</td>
                    <td className="py-3 px-3">
                      <span className={s.features.suspiciousApiCount > 0 ? 'text-red-400 font-bold' : 'text-slate-500'}>
                        {s.features.suspiciousApiCount}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={s.features.packedIndicator ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                        {s.features.packedIndicator ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {s.features.certificatePresent ? (
                        <span className="text-emerald-400 font-bold">VALID</span>
                      ) : (
                        <span className="text-slate-500">NONE</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 font-mono text-xs text-slate-400">
              <span>Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 rounded bg-slate-800 border border-slate-700 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1 rounded bg-slate-800 border border-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload CSV Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              <span>Upload CSV Feature Vector</span>
            </h3>
            <p className="text-xs text-slate-400">
              Paste CSV text containing PE feature vectors (header + data rows). No executable files are permitted.
            </p>

            {uploadError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Dataset Name</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g., Custom Static PE Vector Benchmark"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Description</label>
                <input
                  type="text"
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Optional description"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">CSV Content (Headers: label, fileSize, entropy, ...)</label>
                <textarea
                  rows={6}
                  required
                  value={uploadCsv}
                  onChange={(e) => setUploadCsv(e.target.value)}
                  placeholder={`label,fileSize,entropy,sectionCount,importCount,suspiciousApiCount,packedIndicator
MALWARE,345000,7.3,5,12,3,1
BENIGN,2100000,5.6,4,140,0,0`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  {uploadLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Dataset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
