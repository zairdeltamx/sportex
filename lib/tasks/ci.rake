unless Rails.env.production? || Rails.env.staging? || Rails.env.daily?
  require 'rubocop/rake_task'
  require 'rubycritic/rake_task'
  require 'rspec/core/rake_task'
  require 'yard'
  require 'brakeman'

  namespace :ci do
    namespace :build do
      desc 'Clean logs'
      task :clean do
        File.exist?('log') || FileUtils.mkdir('log')
        FileUtils.rm_rf(Dir.glob('log/test.log'))
        FileUtils.rm_rf(Dir.glob('log/coverage*'))
        FileUtils.rm_rf(Dir.glob('log/rubocop.log'))
      end

      # Rubocop, fails if ruby syntax is wronchy
      RuboCop::RakeTask.new(:rubocop) do |t|
        t.options = %w(-foffenses -fprogress -olog/rubocop.log)
        t.fail_on_error = true
      end

      # Rubycritic, fails if ruby code logic is too wronchy, (complex)
      RubyCritic::RakeTask.new do |task|
        task.options = '--mode-ci --no-browser --minimum-score 85 --format json'
        task.verbose = true
        task.paths   = FileList[
          'app/controllers',
          'app/graphql',
          'app/helpers',
          'app/interactions',
          'app/jobs',
          'app/mailers',
          'app/models',
          'app/parsers',
          'app/serializers',
          'app/services',
          'app/view_objects',
          'app/workers',
        ]
      end

      desc 'Clean git'
      task :git_clean do
        RubyCritic::SourceControlSystem::Git.git('checkout -- .')
      end

      # Simplecov, fails if test coverage is not met to 95
      # please see file .simplecov in root project folder for more info.
      desc 'Run rspec with code coverage analysis and profile option'
      task :simplecov do
        ENV['COVERAGE'] = 'true'
        Rake::Task['ci:build:spec_internal'].invoke
      end

      # Do not show this task in the task list
      RSpec::Core::RakeTask.new(:spec_internal) do |t|
        t.rspec_opts = '--profile'
      end

      # Yard, generates documentation and verifies coverage
      desc 'Generate documentation'
      YARD::Rake::YardocTask.new :documentation_generate

      desc 'Verifies documentation coverage'
      task :documentation_coverage do
        Rake::Task['ci:build:documentation_generate'].invoke

        klasses = YARD::Registry.load!.all(:class, :module, :root)

        ks = klasses.map do |k|
          total              = k.meths.size.to_f
          undocd             = k.meths.select { |m| m.docstring.empty? }.size.to_f

          doc_method_percent = undocd.zero? ? 0.0 : (undocd / total)

          [k, doc_method_percent]
        end

        sorted = ks.sort { |(_, percent), (_, percent2)| percent <=> percent2 }
        values = sorted.map do |(k, p)|
          puts "#{k} - #{p * 100}% undocumented"
          100 - p * 100
        end

        coverage = values.reduce(:+) / values.count

        puts "Project covered in #{coverage}%!"
        fail if coverage < 90
      end

      desc 'Run Brakeman'
      task :brakeman, :output_files do |t, args|
        files = args[:output_files].split(' ') if args[:output_files]
        report = Brakeman.run app_path: ".", output_files: files, print_report: true

        if report.checks.warnings.any?
          fail "Found #{report.checks.warnings.length} warnings, should be zero."
        end

        if report.checks.warnings.length != 0 || report.checks.all_warnings.length != 0
          puts "Found #{report.checks.all_warnings.length} view warnings, should be 0."
          puts "Found #{report.checks.warnings.length} security warnings, should be 0."
          puts "Found #{report.errors.length} parse errors (these can be ignored)."
          fail "!!! Brakeman found warnings that need to be fixed !!!"
        end
      end

      desc 'Run all tests'
      task commit: ['ci:build:clean', 'ci:build:simplecov', 'ci:build:rubocop', 'ci:build:brakeman', 'ci:build:git_clean']
    end
  end
end
