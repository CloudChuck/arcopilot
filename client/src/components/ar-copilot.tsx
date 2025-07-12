import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PatientAccount, InsertPatientAccount, UpdatePatientAccount } from "@shared/schema";
import { denialCodeMappings, insuranceOptions, eligibilityStatusOptions, generateRCMComment } from "@/lib/denial-codes";
import { Plus, X, Stethoscope, Download, Copy, CheckCircle, AlertCircle, ArrowRight, Book, ExternalLink, Bot } from "lucide-react";

const formSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  insuranceName: z.string().min(1, "Insurance name is required"),
  repName: z.string().optional(),
  callReference: z.string().optional(),
  denialCode: z.string().optional(),
  denialDescription: z.string().optional(),
  dateOfService: z.string().optional(),
  eligibilityFromDate: z.string().optional(),
  eligibilityStatus: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ARCopilot() {
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [generatedComment, setGeneratedComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      accountNumber: "",
      insuranceName: "",
      repName: "",
      callReference: "",
      denialCode: "",
      denialDescription: "",
      dateOfService: "",
      eligibilityFromDate: "",
      eligibilityStatus: "",
      additionalNotes: "",
    },
  });

  // Query to fetch patient accounts for current session
  const { data: accounts = [], isLoading } = useQuery<PatientAccount[]>({
    queryKey: ["/api/accounts", sessionId],
  });

  // Mutation to create new patient account
  const createAccountMutation = useMutation({
    mutationFn: async (data: InsertPatientAccount) => {
      const response = await apiRequest("POST", "/api/accounts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts", sessionId] });
      toast({ title: "Success", description: "New patient account created" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create patient account", variant: "destructive" });
    },
  });

  // Mutation to update patient account
  const updateAccountMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePatientAccount }) => {
      const response = await apiRequest("PATCH", `/api/accounts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts", sessionId] });
      toast({ title: "Success", description: "Patient account updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update patient account", variant: "destructive" });
    },
  });

  // Mutation to delete patient account
  const deleteAccountMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts", sessionId] });
      toast({ title: "Success", description: "Patient account deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete patient account", variant: "destructive" });
    },
  });

  const activeAccount = accounts.find(account => account.id === activeTabId);

  // Load active account data into form
  useEffect(() => {
    if (activeAccount) {
      form.reset({
        patientName: activeAccount.patientName || "",
        accountNumber: activeAccount.accountNumber || "",
        insuranceName: activeAccount.insuranceName || "",
        repName: activeAccount.repName || "",
        callReference: activeAccount.callReference || "",
        denialCode: activeAccount.denialCode || "",
        denialDescription: activeAccount.denialDescription || "",
        dateOfService: activeAccount.dateOfService || "",
        eligibilityFromDate: activeAccount.eligibilityFromDate || "",
        eligibilityStatus: activeAccount.eligibilityStatus || "",
        additionalNotes: activeAccount.additionalNotes || "",
      });
    }
  }, [activeAccount, form]);

  // Auto-set first account as active when accounts load
  useEffect(() => {
    if (accounts.length > 0 && activeTabId === null) {
      setActiveTabId(accounts[0].id);
    }
  }, [accounts, activeTabId]);

  const addNewTab = () => {
    const newAccountData: InsertPatientAccount = {
      patientName: "New Patient",
      accountNumber: `ACC-${new Date().getFullYear()}-${String(accounts.length + 1).padStart(3, '0')}`,
      insuranceName: "",
      sessionId,
    };
    createAccountMutation.mutate(newAccountData);
  };

  const closeTab = (accountId: number) => {
    deleteAccountMutation.mutate(accountId);
    if (activeTabId === accountId) {
      const remainingAccounts = accounts.filter(acc => acc.id !== accountId);
      setActiveTabId(remainingAccounts.length > 0 ? remainingAccounts[0].id : null);
    }
  };

  const switchTab = (accountId: number) => {
    if (activeTabId && activeTabId !== accountId) {
      // Save current form data before switching
      const formData = form.getValues();
      updateAccountMutation.mutate({ id: activeTabId, data: formData });
    }
    setActiveTabId(accountId);
  };

  const onSubmit = (data: FormData) => {
    if (activeTabId) {
      updateAccountMutation.mutate({ id: activeTabId, data });
    }
  };

  const handleDenialCodeChange = (denialCode: string) => {
    const mapping = denialCodeMappings[denialCode];
    if (mapping) {
      form.setValue("denialDescription", mapping.description);
      if (activeTabId) {
        updateAccountMutation.mutate({ 
          id: activeTabId, 
          data: { denialCode, denialDescription: mapping.description } 
        });
      }
    }
  };

  const generateComment = () => {
    const formData = form.getValues();
    const comment = generateRCMComment(formData);
    setGeneratedComment(comment);
    toast({ title: "Comment Generated", description: "RCM comment has been generated successfully" });
  };

  const copyComment = async () => {
    try {
      await navigator.clipboard.writeText(generatedComment);
      toast({ title: "Copied", description: "Comment copied to clipboard" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy comment", variant: "destructive" });
    }
  };

  const copyFromTab = (sourceAccountId: string) => {
    const sourceAccount = accounts.find(acc => acc.id === parseInt(sourceAccountId));
    if (sourceAccount && activeTabId) {
      const copyData = {
        repName: sourceAccount.repName,
        callReference: sourceAccount.callReference,
        insuranceName: sourceAccount.insuranceName,
      };
      form.setValue("repName", copyData.repName || "");
      form.setValue("callReference", copyData.callReference || "");
      form.setValue("insuranceName", copyData.insuranceName || "");
      updateAccountMutation.mutate({ id: activeTabId, data: copyData });
      toast({ title: "Data Copied", description: "Selected fields copied from another tab" });
    }
  };

  const getInsuranceLabel = (value: string): string => {
    const option = insuranceOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const exportSession = () => {
    // Create CSV headers
    const headers = [
      'Patient Name',
      'Account Number', 
      'Insurance Name',
      'Rep Name',
      'Call Reference',
      'Denial Code',
      'Denial Description',
      'Date of Service',
      'Eligibility From Date',
      'Eligibility Status',
      'Additional Notes',
      'Created At',
      'Updated At'
    ];
    
    // Convert accounts to CSV rows
    const csvRows = accounts.map(account => [
      account.patientName || '',
      account.accountNumber || '',
      getInsuranceLabel(account.insuranceName) || account.insuranceName || '',
      account.repName || '',
      account.callReference || '',
      account.denialCode || '',
      account.denialDescription || '',
      account.dateOfService || '',
      account.eligibilityFromDate || '',
      account.eligibilityStatus || '',
      account.additionalNotes || '',
      account.createdAt ? new Date(account.createdAt).toLocaleString() : '',
      account.updatedAt ? new Date(account.updatedAt).toLocaleString() : ''
    ]);
    
    // Create CSV content
    const csvContent = [
      // Add session info as header comments
      `# AR Copilot Session Export`,
      `# Session ID: ${sessionId}`,
      `# Export Date: ${new Date().toLocaleString()}`,
      `# Total Accounts: ${accounts.length}`,
      '',
      // Add headers
      headers.join(','),
      // Add data rows
      ...csvRows.map(row => 
        row.map(field => 
          // Escape fields that contain commas, quotes, or newlines
          typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        ).join(',')
      )
    ].join('\n');
    
    // Create and download CSV file
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ar-session-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Session Exported", description: "CSV file has been downloaded with all account data" });
  };



  const currentDenialMapping = form.watch("denialCode") ? denialCodeMappings[form.watch("denialCode")] : null;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">AR Copilot</h1>
              <p className="text-sm text-neutral-600">Healthcare RCM Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-neutral-600">
              Session: {new Date().toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              })}
            </div>
            <Button variant="outline" onClick={exportSession}>
              <Download className="mr-2" size={16} />
              Export Session
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Account Tabs */}
        <div className="w-80 bg-white border-r border-neutral-200 flex flex-col">
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-neutral-900">Patient Accounts</h2>
              <Button size="sm" onClick={addNewTab} className="w-8 h-8 p-0 rounded-full">
                <Plus size={16} />
              </Button>
            </div>
            <p className="text-sm text-neutral-600">Active accounts in current call</p>
          </div>
          
          <ScrollArea className="flex-1">
            {accounts.length === 0 ? (
              <div className="p-4 text-center text-neutral-500">
                <p>No patient accounts yet</p>
                <p className="text-sm">Click + to add your first account</p>
              </div>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className={`border-b border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                    activeTabId === account.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => switchTab(account.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 truncate">{account.patientName}</h3>
                      <p className="text-sm text-neutral-600 truncate">{account.accountNumber}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        {account.denialCode && (
                          <Badge 
                            variant="outline" 
                            className={
                              account.denialCode === 'CO-27' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                              account.denialCode === 'CO-97' ? 'border-green-200 text-green-700 bg-green-50' :
                              account.denialCode === 'PR-204' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                              'border-neutral-200 text-neutral-700 bg-neutral-50'
                            }
                          >
                            {account.denialCode}
                          </Badge>
                        )}
                        {account.insuranceName && (
                          <span className="text-xs text-neutral-500">
                            {insuranceOptions.find(opt => opt.value === account.insuranceName)?.label || account.insuranceName}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 w-6 p-0 text-neutral-400 hover:text-neutral-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(account.id);
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Center Panel - Patient Form */}
        <div className="flex-1 bg-white overflow-y-auto">
          {activeAccount ? (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {activeAccount.patientName} - Account Details
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">Complete patient information and call details</p>
                  </div>
                  <div className="flex space-x-3">
                    <Select onValueChange={copyFromTab}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Copy From Tab..." />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.filter(acc => acc.id !== activeTabId).map((account) => (
                          <SelectItem key={account.id} value={account.id.toString()}>
                            {account.patientName} - {account.accountNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={generateComment} className="bg-secondary hover:bg-green-700">
                      <Bot className="mr-2" size={16} />
                      Generate Comment
                    </Button>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Patient Information Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="patientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient Name *</FormLabel>
                              <FormControl>
                                <Input {...field} onChange={(e) => {
                                  field.onChange(e);
                                  if (activeTabId) {
                                    updateAccountMutation.mutate({ id: activeTabId, data: { patientName: e.target.value } });
                                  }
                                }} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number *</FormLabel>
                              <FormControl>
                                <Input {...field} onChange={(e) => {
                                  field.onChange(e);
                                  if (activeTabId) {
                                    updateAccountMutation.mutate({ id: activeTabId, data: { accountNumber: e.target.value } });
                                  }
                                }} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dateOfService"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Service (DOS) *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} onChange={(e) => {
                                  field.onChange(e);
                                  if (activeTabId) {
                                    updateAccountMutation.mutate({ id: activeTabId, data: { dateOfService: e.target.value } });
                                  }
                                }} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="insuranceName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Insurance Name *</FormLabel>
                              <Select value={field.value} onValueChange={(value) => {
                                field.onChange(value);
                                if (activeTabId) {
                                  updateAccountMutation.mutate({ id: activeTabId, data: { insuranceName: value } });
                                }
                              }}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select insurance" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {insuranceOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Call Information Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Call Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="repName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rep Name *</FormLabel>
                              <FormControl>
                                <Input {...field} onChange={(e) => {
                                  field.onChange(e);
                                  if (activeTabId) {
                                    updateAccountMutation.mutate({ id: activeTabId, data: { repName: e.target.value } });
                                  }
                                }} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="callReference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Call Reference # *</FormLabel>
                              <FormControl>
                                <Input {...field} onChange={(e) => {
                                  field.onChange(e);
                                  if (activeTabId) {
                                    updateAccountMutation.mutate({ id: activeTabId, data: { callReference: e.target.value } });
                                  }
                                }} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Denial Information Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Denial Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="denialCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Denial Code *</FormLabel>
                              <Select value={field.value} onValueChange={(value) => {
                                field.onChange(value);
                                handleDenialCodeChange(value);
                              }}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select denial code" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(denialCodeMappings).map((mapping) => (
                                    <SelectItem key={mapping.code} value={mapping.code}>
                                      {mapping.code} - {mapping.description}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="denialDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Denial Description</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly className="bg-neutral-100 text-neutral-600" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Eligibility Information Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Eligibility Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="eligibilityStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eligibility Status *</FormLabel>
                              <Select value={field.value} onValueChange={(value) => {
                                field.onChange(value);
                                if (activeTabId) {
                                  updateAccountMutation.mutate({ id: activeTabId, data: { eligibilityStatus: value } });
                                }
                              }}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {eligibilityStatusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="eligibilityFromDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eligibility From Date *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} onChange={(e) => {
                                  field.onChange(e);
                                  if (activeTabId) {
                                    updateAccountMutation.mutate({ id: activeTabId, data: { eligibilityFromDate: e.target.value } });
                                  }
                                }} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Additional Notes Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="additionalNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  rows={4} 
                                  placeholder="Enter any additional notes or observations from the call..."
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (activeTabId) {
                                      updateAccountMutation.mutate({ id: activeTabId, data: { additionalNotes: e.target.value } });
                                    }
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Generated Comment Section */}
                    {generatedComment && (
                      <Card className="bg-primary-light border-primary/20">
                        <CardHeader>
                          <CardTitle>Generated RCM Comment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white rounded-lg p-4 border">
                            <Textarea
                              value={generatedComment}
                              onChange={(e) => setGeneratedComment(e.target.value)}
                              rows={3}
                              className="resize-none border-none focus:outline-none"
                            />
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200">
                              <span className="text-xs text-neutral-500">Last updated: Just now</span>
                              <Button onClick={copyComment}>
                                <Copy className="mr-2" size={16} />
                                Copy Comment
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </form>
                </Form>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500">
              <div className="text-center">
                <AlertCircle size={48} className="mx-auto mb-4" />
                <p>No patient account selected</p>
                <p className="text-sm">Select an account from the left panel or create a new one</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - AI Suggestions */}
        <div className="w-96 bg-white border-l border-neutral-200 flex flex-col">
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <Bot className="text-white" size={12} />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">AI Suggestions</h2>
            </div>
            <p className="text-sm text-neutral-600">
              {currentDenialMapping ? (
                <>Dynamic guidance for <Badge variant="outline" className="ml-1 border-orange-200 text-orange-700 bg-orange-50">{currentDenialMapping.code}</Badge> denial code</>
              ) : (
                "Select a denial code to see dynamic guidance"
              )}
            </p>
          </div>
          
          <ScrollArea className="flex-1 p-4 space-y-6">
            {currentDenialMapping ? (
              <>
                {/* Questions to Ask Section */}
                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <AlertCircle className="text-orange-600 mr-2" size={16} />
                      Questions to Ask Rep
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {currentDenialMapping.questions.map((question, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-5 h-5 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-700 text-xs font-bold">{index + 1}</span>
                          </span>
                          <span className="text-neutral-700">"{question}"</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Required Fields Section */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <CheckCircle className="text-blue-600 mr-2" size={16} />
                      Required Fields to Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentDenialMapping.requiredFields.map((fieldName) => {
                        const formValue = form.watch(fieldName as keyof FormData);
                        const isComplete = Boolean(formValue);
                        return (
                          <div key={fieldName} className="flex items-center justify-between">
                            <span className="text-sm text-neutral-700 capitalize">
                              {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <Badge 
                              variant={isComplete ? "default" : "outline"}
                              className={isComplete ? "bg-green-100 text-green-700 border-green-200" : "border-neutral-300 text-neutral-500"}
                            >
                              {isComplete ? (
                                <>
                                  <CheckCircle className="mr-1" size={12} />
                                  Complete
                                </>
                              ) : (
                                "Pending"
                              )}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps Section */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <ArrowRight className="text-green-600 mr-2" size={16} />
                      Recommended Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-neutral-700">
                      {currentDenialMapping.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Additional Resources */}
                <Card className="bg-neutral-100 border-neutral-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Book className="text-neutral-600 mr-2" size={16} />
                      Additional Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <a href="#" className="block text-sm text-primary hover:text-primary-dark transition-colors">
                        <ExternalLink className="mr-1 inline" size={12} />
                        {currentDenialMapping.code} Denial Code Reference
                      </a>
                      <a href="#" className="block text-sm text-primary hover:text-primary-dark transition-colors">
                        <ExternalLink className="mr-1 inline" size={12} />
                        Eligibility Verification Guide
                      </a>
                      <a href="#" className="block text-sm text-primary hover:text-primary-dark transition-colors">
                        <ExternalLink className="mr-1 inline" size={12} />
                        Insurance Coverage Policies
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center text-neutral-500 mt-8">
                <Bot size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a denial code to view</p>
                <p className="text-sm">AI-powered suggestions and guidance</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
