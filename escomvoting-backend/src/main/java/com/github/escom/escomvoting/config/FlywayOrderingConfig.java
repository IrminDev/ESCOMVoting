package com.github.escom.escomvoting.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayOrderingConfig {

    @Bean(name = "manualFlyway", initMethod = "migrate")
    public Flyway manualFlyway(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .load();
    }

    @Bean
    public static BeanFactoryPostProcessor entityManagerFactoryDependsOnFlyway() {
        return beanFactory -> addDependency(beanFactory, "entityManagerFactory", "manualFlyway");
    }

    private static void addDependency(ConfigurableListableBeanFactory beanFactory, String beanName, String dependsOnBean) {
        if (!(beanFactory instanceof BeanDefinitionRegistry registry)) {
            return;
        }
        if (!registry.containsBeanDefinition(beanName)) {
            return;
        }

        var definition = registry.getBeanDefinition(beanName);
        var currentDependsOn = definition.getDependsOn();
        if (currentDependsOn == null || currentDependsOn.length == 0) {
            definition.setDependsOn(dependsOnBean);
            return;
        }
        for (String existing : currentDependsOn) {
            if (dependsOnBean.equals(existing)) {
                return;
            }
        }

        String[] updated = new String[currentDependsOn.length + 1];
        System.arraycopy(currentDependsOn, 0, updated, 0, currentDependsOn.length);
        updated[currentDependsOn.length] = dependsOnBean;
        definition.setDependsOn(updated);
    }
}
