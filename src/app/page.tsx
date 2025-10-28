'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus, TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, Filter, Trash2, Edit3, Target, Briefcase, BarChart3, Wallet, CreditCard, Building, Coins, TrendingUpIcon, AlertTriangle, CheckCircle, Menu, X } from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: Date
}

interface Investment {
  id: string
  name: string
  type: 'stocks' | 'crypto' | 'funds' | 'bonds' | 'real_estate'
  amount: number
  currentValue: number
  purchaseDate: Date
  quantity: number
  symbol: string
}

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: string
  priority: 'low' | 'medium' | 'high'
}

const INCOME_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'
]

const EXPENSE_CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 
  'Entretenimento', 'Roupas', 'Tecnologia', 'Outros'
]

const INVESTMENT_TYPES = [
  { value: 'stocks', label: 'Ações', icon: TrendingUp },
  { value: 'crypto', label: 'Criptomoedas', icon: Coins },
  { value: 'funds', label: 'Fundos', icon: Briefcase },
  { value: 'bonds', label: 'Títulos', icon: Building },
  { value: 'real_estate', label: 'Imóveis', icon: Building }
]

const GOAL_CATEGORIES = [
  'Emergência', 'Viagem', 'Casa', 'Carro', 'Educação', 'Aposentadoria', 'Outros'
]

const COLORS = [
  '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
  '#EC4899', '#6366F1', '#84CC16', '#F97316', '#14B8A6'
]

export default function FinanceApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'investments' | 'goals'>('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showInvestmentForm, setShowInvestmentForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  })

  const [investmentFormData, setInvestmentFormData] = useState({
    name: '',
    type: 'stocks' as Investment['type'],
    amount: '',
    currentValue: '',
    quantity: '',
    symbol: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd')
  })

  const [goalFormData, setGoalFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    priority: 'medium' as Goal['priority']
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-transactions')
    const savedInvestments = localStorage.getItem('finance-investments')
    const savedGoals = localStorage.getItem('finance-goals')
    
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions)
      setTransactions(parsed.map((t: any) => ({ ...t, date: new Date(t.date) })))
    }
    
    if (savedInvestments) {
      const parsed = JSON.parse(savedInvestments)
      setInvestments(parsed.map((i: any) => ({ ...i, purchaseDate: new Date(i.purchaseDate) })))
    }
    
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals)
      setGoals(parsed.map((g: any) => ({ ...g, deadline: new Date(g.deadline) })))
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('finance-investments', JSON.stringify(investments))
  }, [investments])

  useEffect(() => {
    localStorage.setItem('finance-goals', JSON.stringify(goals))
  }, [goals])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const transaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date)
    }

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? transaction : t))
      setEditingTransaction(null)
    } else {
      setTransactions(prev => [...prev, transaction])
    }

    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd')
    })
    setShowForm(false)
  }

  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const investment: Investment = {
      id: editingInvestment?.id || Date.now().toString(),
      name: investmentFormData.name,
      type: investmentFormData.type,
      amount: parseFloat(investmentFormData.amount),
      currentValue: parseFloat(investmentFormData.currentValue),
      quantity: parseFloat(investmentFormData.quantity),
      symbol: investmentFormData.symbol,
      purchaseDate: new Date(investmentFormData.purchaseDate)
    }

    if (editingInvestment) {
      setInvestments(prev => prev.map(i => i.id === editingInvestment.id ? investment : i))
      setEditingInvestment(null)
    } else {
      setInvestments(prev => [...prev, investment])
    }

    setInvestmentFormData({
      name: '',
      type: 'stocks',
      amount: '',
      currentValue: '',
      quantity: '',
      symbol: '',
      purchaseDate: format(new Date(), 'yyyy-MM-dd')
    })
    setShowInvestmentForm(false)
  }

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const goal: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      name: goalFormData.name,
      targetAmount: parseFloat(goalFormData.targetAmount),
      currentAmount: parseFloat(goalFormData.currentAmount),
      deadline: new Date(goalFormData.deadline),
      category: goalFormData.category,
      priority: goalFormData.priority
    }

    if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? goal : g))
      setEditingGoal(null)
    } else {
      setGoals(prev => [...prev, goal])
    }

    setGoalFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: format(new Date(), 'yyyy-MM-dd'),
      category: '',
      priority: 'medium'
    })
    setShowGoalForm(false)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: format(transaction.date, 'yyyy-MM-dd')
    })
    setShowForm(true)
  }

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment)
    setInvestmentFormData({
      name: investment.name,
      type: investment.type,
      amount: investment.amount.toString(),
      currentValue: investment.currentValue.toString(),
      quantity: investment.quantity.toString(),
      symbol: investment.symbol,
      purchaseDate: format(investment.purchaseDate, 'yyyy-MM-dd')
    })
    setShowInvestmentForm(true)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: format(goal.deadline, 'yyyy-MM-dd'),
      category: goal.category,
      priority: goal.priority
    })
    setShowGoalForm(true)
  }

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleDeleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id))
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  // Filtrar transações por mês e tipo
  const filteredTransactions = transactions.filter(transaction => {
    const monthMatch = isWithinInterval(transaction.date, {
      start: startOfMonth(selectedMonth),
      end: endOfMonth(selectedMonth)
    })
    const typeMatch = filterType === 'all' || transaction.type === filterType
    return monthMatch && typeMatch
  })

  // Calcular totais
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpenses

  // Calcular totais de investimentos
  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0)
  const totalCurrentValue = investments.reduce((sum, i) => sum + i.currentValue, 0)
  const totalGain = totalCurrentValue - totalInvested
  const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

  // Dados para gráficos - CORRIGIDO PARA FUNCIONAR COM FILTROS
  const categoryData = filteredTransactions
    .reduce((acc, transaction) => {
      const existing = acc.find(item => item.category === transaction.category)
      if (existing) {
        existing.amount += transaction.amount
      } else {
        acc.push({
          category: transaction.category,
          amount: transaction.amount,
          type: transaction.type
        })
      }
      return acc
    }, [] as { category: string; amount: number; type: string }[])

  // Filtrar dados do gráfico baseado no filtro selecionado
  const chartData = filterType === 'all' 
    ? categoryData 
    : categoryData.filter(d => d.type === filterType)

  const monthlyData = transactions
    .reduce((acc, transaction) => {
      const month = format(transaction.date, 'MMM', { locale: ptBR })
      const existing = acc.find(item => item.month === month)
      
      if (existing) {
        if (transaction.type === 'income') {
          existing.receitas += transaction.amount
        } else {
          existing.despesas += transaction.amount
        }
      } else {
        acc.push({
          month,
          receitas: transaction.type === 'income' ? transaction.amount : 0,
          despesas: transaction.type === 'expense' ? transaction.amount : 0
        })
      }
      return acc
    }, [] as { month: string; receitas: number; despesas: number }[])
    .slice(-6)

  const investmentsByType = investments.reduce((acc, investment) => {
    const existing = acc.find(item => item.type === investment.type)
    if (existing) {
      existing.amount += investment.currentValue
    } else {
      acc.push({
        type: investment.type,
        amount: investment.currentValue,
        label: INVESTMENT_TYPES.find(t => t.value === investment.type)?.label || investment.type
      })
    }
    return acc
  }, [] as { type: string; amount: number; label: string }[])

  const renderDashboard = () => (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <DollarSign className="text-emerald-600" />
            Finanças Pessoais
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Controle suas receitas e despesas de forma inteligente
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>

            <input
              type="month"
              value={format(selectedMonth, 'yyyy-MM')}
              onChange={(e) => setSelectedMonth(new Date(e.target.value + '-01'))}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico de Pizza - Categorias */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            {filterType === 'income' ? 'Receitas por Categoria' : 
             filterType === 'expense' ? 'Despesas por Categoria' : 
             'Transações por Categoria'}
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="amount"
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              Nenhum dado para exibir
            </div>
          )}
        </div>

        {/* Gráfico de Barras - Evolução Mensal */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Evolução Mensal
          </h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']} />
                <Legend />
                <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              Nenhum dado para exibir
            </div>
          )}
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Transações Recentes ({filteredTransactions.length})
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Nenhuma transação encontrada para os filtros selecionados
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredTransactions
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'income' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {transaction.category} • {format(transaction.date, 'dd/MM/yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-lg ${
                          transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  )

  const renderInvestments = () => (
    <>
      {/* Header Investimentos */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Briefcase className="text-purple-600" />
            Carteira de Investimentos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Acompanhe seus investimentos e performance
          </p>
        </div>
        
        <button
          onClick={() => setShowInvestmentForm(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Novo Investimento
        </button>
      </div>

      {/* Gráficos de Investimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Diversificação por Tipo */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Diversificação por Tipo
          </h3>
          {investmentsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={investmentsByType}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="amount"
                  label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                >
                  {investmentsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              Nenhum investimento cadastrado
            </div>
          )}
        </div>

        {/* Performance Individual */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Performance Individual
          </h3>
          {investments.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {investments.map((investment) => {
                const gain = investment.currentValue - investment.amount
                const gainPercent = (gain / investment.amount) * 100
                return (
                  <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{investment.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{investment.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {gain >= 0 ? '+' : ''}R$ {gain.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-sm ${gainPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              Nenhum investimento cadastrado
            </div>
          )}
        </div>
      </div>

      {/* Lista de Investimentos */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Meus Investimentos ({investments.length})
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {investments.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Nenhum investimento cadastrado. Adicione seu primeiro investimento!
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {investments
                .sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime())
                .map((investment) => {
                  const gain = investment.currentValue - investment.amount
                  const gainPercent = (gain / investment.amount) * 100
                  const TypeIcon = INVESTMENT_TYPES.find(t => t.value === investment.type)?.icon || Briefcase
                  
                  return (
                    <div key={investment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                            <TypeIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {investment.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {investment.symbol} • {investment.quantity} unidades • {format(investment.purchaseDate, 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
                              R$ {investment.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className={`text-sm ${gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {gain >= 0 ? '+' : ''}R$ {gain.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
                            </p>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditInvestment(investment)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInvestment(investment.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </>
  )

  const renderGoals = () => (
    <>
      {/* Header Metas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Target className="text-orange-600" />
            Metas Financeiras
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Defina e acompanhe suas metas financeiras
          </p>
        </div>
        
        <button
          onClick={() => setShowGoalForm(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      </div>

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400 shadow-lg border border-gray-100 dark:border-slate-700">
            Nenhuma meta cadastrada. Crie sua primeira meta financeira!
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            const isCompleted = progress >= 100
            const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            
            return (
              <div key={goal.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      goal.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                      goal.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : daysLeft < 30 ? (
                        <AlertTriangle className={`w-5 h-5 ${
                          goal.priority === 'high' ? 'text-red-600' :
                          goal.priority === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      ) : (
                        <Target className={`w-5 h-5 ${
                          goal.priority === 'high' ? 'text-red-600' :
                          goal.priority === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{goal.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Atual:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Meta:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Prazo:</span>
                    <span className={`text-sm font-semibold ${
                      daysLeft < 0 ? 'text-red-600' : daysLeft < 30 ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      {daysLeft < 0 ? 'Vencida' : `${daysLeft} dias`}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Faltam: R$ {(goal.targetAmount - goal.currentAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Menu Hambúrguer - Navegação */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowHamburgerMenu(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline">Menu</span>
          </button>
          
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'investments'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Investimentos</span>
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'goals'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Metas</span>
            </button>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'investments' && renderInvestments()}
        {activeTab === 'goals' && renderGoals()}

        {/* Menu Hambúrguer - Cards de Resumo */}
        {showHamburgerMenu && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="text-blue-600" />
                  Resumo Financeiro
                </h3>
                <button
                  onClick={() => setShowHamburgerMenu(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cards de Resumo no Menu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Receitas */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-emerald-500 p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Receitas do Mês</p>
                      <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                        R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">
                    💰 Total de entradas financeiras
                  </div>
                </div>

                {/* Card Despesas */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-500 p-3 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-red-700 dark:text-red-300 text-sm font-medium">Despesas do Mês</p>
                      <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                        R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    💸 Total de gastos realizados
                  </div>
                </div>

                {/* Card Saldo */}
                <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' : 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'} rounded-2xl p-6 border ${balance >= 0 ? 'border-blue-200 dark:border-blue-800' : 'border-orange-200 dark:border-orange-800'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'} p-3 rounded-xl`}>
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className={`${balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'} text-sm font-medium`}>Saldo Atual</p>
                      <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-orange-800 dark:text-orange-200'}`}>
                        R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {balance >= 0 ? '✅ Situação positiva' : '⚠️ Atenção ao orçamento'}
                  </div>
                </div>

                {/* Card Investimentos */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-500 p-3 rounded-xl">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Investimentos</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        R$ {totalCurrentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-sm ${gainPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}% de rentabilidade
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    📈 Valor atual da carteira
                  </div>
                </div>

                {/* Card Metas */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800 md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-orange-500 p-3 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-orange-700 dark:text-orange-300 text-sm font-medium">Metas Financeiras</p>
                      <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                        {goals.length} {goals.length === 1 ? 'Meta' : 'Metas'}
                      </p>
                    </div>
                  </div>
                  
                  {goals.length > 0 ? (
                    <div className="space-y-3">
                      {goals.slice(0, 3).map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100
                        return (
                          <div key={goal.id} className="bg-white dark:bg-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900 dark:text-white text-sm">{goal.name}</span>
                              <span className="text-sm font-bold text-orange-600">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                      {goals.length > 3 && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
                          +{goals.length - 3} metas adicionais
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      🎯 Nenhuma meta cadastrada ainda
                    </div>
                  )}
                </div>
              </div>

              {/* Botão para fechar */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowHamburgerMenu(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Fechar Resumo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal do Formulário de Transação */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        formData.type === 'income'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      Receita
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        formData.type === 'expense'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <TrendingDown className="w-4 h-4 inline mr-2" />
                      Despesa
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0,00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Descrição da transação"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingTransaction(null)
                      setFormData({
                        type: 'expense',
                        amount: '',
                        category: '',
                        description: '',
                        date: format(new Date(), 'yyyy-MM-dd')
                      })
                    }}
                    className="flex-1 py-2 px-4 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium transition-all duration-300"
                  >
                    {editingTransaction ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal do Formulário de Investimento */}
        {showInvestmentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingInvestment ? 'Editar Investimento' : 'Novo Investimento'}
              </h3>
              
              <form onSubmit={handleInvestmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Investimento
                  </label>
                  <input
                    type="text"
                    value={investmentFormData.name}
                    onChange={(e) => setInvestmentFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: Ações da Apple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={investmentFormData.type}
                    onChange={(e) => setInvestmentFormData(prev => ({ ...prev, type: e.target.value as Investment['type'] }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    {INVESTMENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor Investido
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={investmentFormData.amount}
                      onChange={(e) => setInvestmentFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor Atual
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={investmentFormData.currentValue}
                      onChange={(e) => setInvestmentFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={investmentFormData.quantity}
                      onChange={(e) => setInvestmentFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Símbolo
                    </label>
                    <input
                      type="text"
                      value={investmentFormData.symbol}
                      onChange={(e) => setInvestmentFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="AAPL"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data da Compra
                  </label>
                  <input
                    type="date"
                    value={investmentFormData.purchaseDate}
                    onChange={(e) => setInvestmentFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInvestmentForm(false)
                      setEditingInvestment(null)
                      setInvestmentFormData({
                        name: '',
                        type: 'stocks',
                        amount: '',
                        currentValue: '',
                        quantity: '',
                        symbol: '',
                        purchaseDate: format(new Date(), 'yyyy-MM-dd')
                      })
                    }}
                    className="flex-1 py-2 px-4 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium transition-all duration-300"
                  >
                    {editingInvestment ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal do Formulário de Meta */}
        {showGoalForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingGoal ? 'Editar Meta' : 'Nova Meta'}
              </h3>
              
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome da Meta
                  </label>
                  <input
                    type="text"
                    value={goalFormData.name}
                    onChange={(e) => setGoalFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Reserva de Emergência"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoria
                  </label>
                  <select
                    value={goalFormData.category}
                    onChange={(e) => setGoalFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {GOAL_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor Meta
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={goalFormData.targetAmount}
                      onChange={(e) => setGoalFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor Atual
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={goalFormData.currentAmount}
                      onChange={(e) => setGoalFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prazo
                    </label>
                    <input
                      type="date"
                      value={goalFormData.deadline}
                      onChange={(e) => setGoalFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={goalFormData.priority}
                      onChange={(e) => setGoalFormData(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoalForm(false)
                      setEditingGoal(null)
                      setGoalFormData({
                        name: '',
                        targetAmount: '',
                        currentAmount: '',
                        deadline: format(new Date(), 'yyyy-MM-dd'),
                        category: '',
                        priority: 'medium'
                      })
                    }}
                    className="flex-1 py-2 px-4 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition-all duration-300"
                  >
                    {editingGoal ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}