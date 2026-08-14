/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  MessageCircle,
  RefreshCw,
  Save,
} from 'lucide-react';
import { api } from '../../utils/api';

const eventLabels = {
  order_placed: 'Order placed',
  order_confirmed: 'Order confirmed',
  order_shipped: 'Order shipped',
  order_delivered: 'Order delivered',
  order_cancelled: 'Order cancelled',
};

const statusStyles = {
  sent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  skipped: 'bg-amber-50 text-amber-700 border-amber-200',
};

const inputClass =
  'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#114232]/20';

const normalizeEvents = (events = {}) =>
  Object.fromEntries(
    Object.keys(eventLabels).map((key) => [
      key,
      {
        enabled: Boolean(events[key]?.enabled),
        templateName: events[key]?.templateName || key,
        variables: Array.isArray(events[key]?.variables)
          ? events[key].variables
          : [],
      },
    ]),
  );

const AdminAutomation = () => {
  const [events, setEvents] = useState(() => normalizeEvents());
  const [connection, setConnection] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [testEvent, setTestEvent] = useState('order_placed');
  const [liveTest, setLiveTest] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [settingsResponse, logsResponse] = await Promise.all([
        api.get('/automation/settings'),
        api.get('/automation/logs?limit=100'),
      ]);
      setEvents(normalizeEvents(settingsResponse.data?.events));
      setConnection(settingsResponse.connection || {});
      setLogs(Array.isArray(logsResponse.data) ? logsResponse.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load WhatsApp automation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateEvent = (eventKey, patch) => {
    setEvents((current) => ({
      ...current,
      [eventKey]: { ...current[eventKey], ...patch },
    }));
  };

  const save = async () => {
    try {
      setSaving(true);
      setError('');
      setMessage('');
      const response = await api.put('/automation/settings', { events });
      setEvents(normalizeEvents(response.data?.events));
      setMessage('WhatsApp automation settings saved successfully.');
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      setError(err.message || 'Failed to save automation settings.');
    } finally {
      setSaving(false);
    }
  };

  const runTest = async () => {
    try {
      setTesting(true);
      setError('');
      setMessage('');
      setTestResult(null);
      const response = await api.post('/automation/test', {
        recipient: testRecipient,
        event: testEvent,
        live: liveTest,
      });
      setTestResult(response);
      setMessage(response.message);
    } catch (err) {
      setError(err.message || 'WhatsApp automation test failed.');
    } finally {
      setTesting(false);
    }
  };

  const enabledCount = useMemo(
    () => Object.values(events).filter((event) => event.enabled).length,
    [events],
  );

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-400">
        Loading WhatsApp automation…
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle size={22} />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-gray-800">
                WhatsApp Automation
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {enabledCount} of {Object.keys(events).length} order events enabled
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="p-3 border border-gray-200 rounded-xl text-gray-500 hover:bg-white"
            title="Refresh settings and logs"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="bg-[#114232] text-[#efdbbb] px-5 py-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Saving…' : 'Save automation'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex gap-2 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex gap-2 text-sm">
          <Check size={18} />
          {message}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              Meta WhatsApp Cloud API
            </p>
            <p className="font-semibold text-gray-800 mt-1">
              {connection.hasCredentials ? 'Connected' : 'Configuration required'}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1.5 rounded-full border text-[10px] uppercase font-semibold ${
                connection.phoneNumberIdPresent
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              Phone ID {connection.phoneNumberIdPresent ? 'present' : 'missing'}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full border text-[10px] uppercase font-semibold ${
                connection.accessTokenPresent
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              Token {connection.accessTokenPresent ? 'present' : 'missing'}
            </span>
          </div>
        </div>
        {!connection.hasCredentials && (
          <p className="text-xs text-gray-500 mt-4 border-t pt-4">
            Add <code>WHATSAPP_PHONE_NUMBER_ID</code> and{' '}
            <code>WHATSAPP_ACCESS_TOKEN</code> to the backend environment, then
            restart the server. Secrets are intentionally never displayed here.
          </p>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h4 className="font-serif text-lg text-gray-800">Test order notification</h4>
            <p className="text-xs text-gray-400 mt-1">
              Preview the Meta payload safely, or explicitly enable a live test send.
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded-full border text-[10px] uppercase font-semibold ${liveTest ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
            {liveTest ? 'Live send' : 'Dry run'}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className={inputClass}
            value={testRecipient}
            onChange={(event) => setTestRecipient(event.target.value)}
            placeholder="WhatsApp number, e.g. 919876543210"
          />
          <select className={inputClass} value={testEvent} onChange={(event) => setTestEvent(event.target.value)}>
            {Object.entries(eventLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-3 mt-4 text-sm text-gray-600">
          <input type="checkbox" checked={liveTest} onChange={(event) => setLiveTest(event.target.checked)} />
          Send a real template message through Meta (may incur charges)
        </label>
        <button
          type="button"
          onClick={runTest}
          disabled={testing || !testRecipient.trim()}
          className="mt-5 bg-[#114232] text-[#efdbbb] px-5 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
        >
          {testing ? 'Testing…' : liveTest ? 'Send live test' : 'Preview payload'}
        </button>
        {testResult?.payload && (
          <pre className="mt-5 p-4 rounded-xl bg-gray-950 text-emerald-300 text-xs overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        )}
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        {Object.entries(events).map(([eventKey, event]) => (
          <div
            key={eventKey}
            className={`bg-white border rounded-3xl p-6 shadow-sm transition-colors ${
              event.enabled ? 'border-emerald-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-serif text-lg text-gray-800">
                  {eventLabels[eventKey]}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                  {eventKey}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={event.enabled}
                  onChange={(e) =>
                    updateEvent(eventKey, { enabled: e.target.checked })
                  }
                />
                <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />
              </label>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-[#114232] font-semibold">
                  Approved Meta template name
                </label>
                <input
                  className={inputClass}
                  value={event.templateName}
                  onChange={(e) =>
                    updateEvent(eventKey, { templateName: e.target.value })
                  }
                  placeholder={eventKey}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-[#114232] font-semibold">
                  Body variables, in template order
                </label>
                <input
                  className={inputClass}
                  value={event.variables.join(', ')}
                  onChange={(e) =>
                    updateEvent(eventKey, {
                      variables: e.target.value
                        .split(',')
                        .map((value) => value.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="customerName, itemNames"
                />
                <p className="text-[10px] text-gray-400">
                  Supported values: customerName, itemNames, orderId, amount, storeName, statusLink
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between">
          <div>
            <h4 className="font-serif text-lg text-gray-800">
              Delivery logs
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              Latest {logs.length} WhatsApp automation attempts
            </p>
          </div>
        </div>
        {!logs.length ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No automation attempts have been logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Event</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Message / Error</th>
                  <th className="px-5 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-4 font-mono text-xs">
                      #{String(log.orderId).slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <p>{log.customerName || 'Customer'}</p>
                      <p className="text-xs text-gray-400">
                        {log.contactPhone || 'No phone'}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {eventLabels[log.event] || log.event}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] uppercase font-semibold ${
                          statusStyles[log.status] ||
                          'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-xs truncate">
                        {log.messageId || log.error || '—'}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {log.sentAt
                        ? new Date(log.sentAt).toLocaleString('en-IN')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAutomation;
